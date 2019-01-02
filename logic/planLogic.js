let PlanModel = require('../logicModels/PlanModel.js');
let NotificationModel = require('../logicModels/NotificationModel.js');
let PlanParticipantModel = require('../logicModels/PlanParticipantModel.js');
let Enums = require('../logicModels/Enum.js');
let aspectLogic = require('./aspectLogic.js');
let sharedLogic = require('./sharedLogic.js');
let userLogic = require('./userLogic.js');

let planLogic = {
    setPlan : function (uid, planModel = new PlanModel(), language = 'en', thenFunc, errFunc)
    {
        if(uid == undefined || uid == '')
            return errFunc(resourceHelper.Resources.noAuthenticationUserFound, HttpStatus.NO_CONTENT);
        let userQuery = new ViewQueryModel();
        userQuery.view = 'detailed_user';
        userQuery.JSONFilter = {uid: {[Op.eq] : uid}};
        userQuery.then = function (userData){
            if(userData.length > 0){
                return ormContainer.Transaction(function(tran){
                        let planIUModel = new InsertOrUpdateModel();
                        planModel.userId = userData[0].id;
                        planModel.invitedUsers.push(planModel.userId);
                        planIUModel.object = planModel;
                        planIUModel.table = 'plan';
                        var thenIUFunc = function(planRef){
                            planModel.planKey = planRef.id;
                            if(planModel.invitedUsers.length > 0){
                                let index = 0;
                                let participantThen = function(){
                                    let participantQuery = new QueryJSONModel();
                                    participantQuery.table = 'plan_participant';
                                    participantQuery.JSONFilter = {[Op.and] : [ {userId: {[Op.eq]: planModel.invitedUsers[index]}}, {planId: {[Op.eq]: planRef.id}}]}
                                    participantQuery.then = function(participantData){
                                        if(participantData.length==0){
                                            let participantInsertModel = new InsertModel();
                                            let participant = new PlanParticipantModel();
                                            participant.planId = planRef.id;
                                            participant.userId = planModel.invitedUsers[index];
                                            participant.status = Enums.InvitationStatus.Invited;
                                            participantInsertModel.object = participant;
                                            participantInsertModel.table = 'plan_participant';
                                            participantInsertModel.then = function(){
                                                let notificationInsertModel = new InsertModel();
                                                let notification = new NotificationModel();
                                                notification.keyId = NOTIFICATIONS.TYPES.INVITE_PLAN;
                                                notification.notificationDate = moment.utc().valueOf();
                                                notification.userId = planModel.invitedUsers[index];
                                                notification.content = planModel;
                                                notificationInsertModel.object = notification;
                                                notificationInsertModel.table = 'notification';
                                                notificationInsertModel.then = function(){
                                                    index++;
                                                    if(index >= planModel.invitedUsers.length)
                                                        return planModel;
                                                    return participantThen();
                                                }
                                                return ormContainer.Insert(notificationInsertModel, tran);
                                            }
                                            return ormContainer.Insert(participantInsertModel, tran);
                                        }
                                        index++;
                                        if(index >= planModel.invitedUsers.length)
                                            return planModel;
                                        return participantThen();
                                    }
                                    return ormContainer.SelectByJSONOperands(participantQuery);
                                }
                                return participantThen();
                            }
                            return planModel;
                        };
                        planIUModel.then = thenIUFunc;
                        return ormContainer.InsertOrUpdate(planIUModel, tran);
                    }, function(result){
                        return thenFunc(result);
                    },
                    function(err){return errFunc(err.message, HttpStatus.BAD_REQUEST)} );
            }
            return errFunc(resourceHelper.Resources.noAuthenticationUserFound, HttpStatus.BAD_REQUEST);
        }
        return ormContainer.SelectViewByQuery(userQuery);
    },
    setInvitationStatus: function (uid, planId, status, language, thenFunc, errFunc){
        userLogic.getDetailedUser(uid, function(user) {
            let invitationQuery = new QueryJSONModel();
            invitationQuery.page = 0;
            invitationQuery.pageSize = 1;
            invitationQuery.table = 'plan_participant';
            invitationQuery.JSONFilter = { [Op.and] : [{planId : {[Op.eq] : planId}}, {userId : {[Op.eq] : user.id}}] };
            invitationQuery.then = function(invitationData){
                if(invitationData.length > 0){
                    let invitationUpdate = new UpdateModel();
                    invitationUpdate.table = 'plan_participant'
                    invitationUpdate.object = {status : status, updatedAt: formattedDate(new Date())};
                    invitationUpdate.where = { [Op.and] : [{planId : {[Op.eq] : planId}}, {userId : {[Op.eq] : user.id}}] };
                    invitationUpdate.err = errFunc;
                    invitationUpdate.then = function (data) {
                        return thenFunc(data);
                    }
                    return ormContainer.Update(invitationUpdate);
                }else{
                    let invitationInsert = new InsertModel();
                    invitationInsert.table = 'plan_participant'
                    invitationInsert.object = {planId : planId, userId : user.id, status : status};
                    invitationInsert.where = { [Op.and] : [{planId : {[Op.eq] : planId}}, {userId : {[Op.eq] : user.id}}] };
                    invitationInsert.err = errFunc;
                    invitationInsert.then = function (data) {
                        return thenFunc(data);
                    }
                    return ormContainer.Insert(invitationInsert);
                }
            }
            return ormContainer.SelectByJSONOperands(invitationQuery);

        });
    },
    removePlan: function (id, language = 'en', thenFunc, errFunc) {
        let cancelPlanQuery = new UpdateModel();
        cancelPlanQuery.table = 'plan';
        cancelPlanQuery.where = {id : {[Op.eq] : id}};
        cancelPlanQuery.object = { cancelled : true };
        cancelPlanQuery.then = function(data){
            return thenFunc(data);
        }
        cancelPlanQuery.err = errFunc;
        return ormContainer.Update(cancelPlanQuery);
    },
    getPlan : function(id, language, thenFunc, errFunc){
        let planQuery = new QueryJSONModel();
        planQuery.table = 'plan';
        planQuery.JSONFilter = {
            [Op.and] : [
                {id : { [Op.eq] : id }},
                {cancelled : { [Op.eq] : false }}
            ]
        }
        planQuery.then = function(planRef){
            if(planRef.length > 0){
                let planData = planRef[0];
                let eventQuery = new ViewQueryModel();
                eventQuery.view = 'detailed_event';
                eventQuery.JSONFilter = {id: {[Op.eq] : planData.eventId}};
                eventQuery.then = function (events){
                    let query = new ViewQueryModel();
                    query.view = 'detailed_plan_participant';
                    query.JSONFilter = {[Op.and] : [{plan_id : { [Op.eq] : id }}]};
                    query.then = function(data){
                        let commentQuery = new ViewQueryModel();
                        commentQuery.view = 'detailed_comment';
                        commentQuery.page = 0;
                        commentQuery.pageSize = 5;
                        commentQuery.JSONFilter = {plan_id: {[Op.eq] : id}};
                        commentQuery.then = function (comments){
                            let owner;
                            planData.detailedFriends = [];
                            planData.invitedUsers = [];
                            for(let q = 0; q < data.length; q++){
                                if(data[q].id == planData.userId){
                                    planData.owner = data[q];
                                }
                                if(data[q].status == Enums.InvitationStatus.Invited){
                                    planData.detailedFriends.push({
                                        uid : data[q].uid,
                                        id : data[q].id,
                                        photo : data[q].photo,
                                        firstName : data[q].firstName,
                                        lastName: data[q].lastName,
                                        middleName: data[q].middleName
                                    });
                                }else if(data[q].status == Enums.InvitationStatus.Accepted){
                                    planData.invitedUsers.push({
                                        uid : data[q].uid,
                                        id : data[q].id,
                                        photo : data[q].photo,
                                        firstName : data[q].firstName,
                                        lastName: data[q].lastName,
                                        middleName: data[q].middleName
                                    });
                                }
                                if(events.length > 0) planData.event = events[0];
                                planData.comments = comments.map(function(comment){
                                    if(comment.planId == planData.id)
                                        return {
                                            id : comment.id,
                                            text : comment.content,
                                            uid : comment.uid,
                                            owner : {
                                                id : comment.userId,
                                                uid : comment.uid,
                                                firstName : comment.firstName,
                                                lastName : comment.lastName,
                                                middleName : comment.middleName,
                                                photo : comment.photo
                                            }
                                        }
                                });
                            }
                            return thenFunc(planData)
                        }
                        return ormContainer.SelectViewByQuery(commentQuery)
                    }
                    return ormContainer.SelectViewByQuery(query);
                }
                return ormContainer.SelectViewByQuery(eventQuery)
            }
            return errFunc(resourceHelper.Resources.noPlanFound, HttpStatus.BAD_REQUEST);
        }
        return ormContainer.SelectByJSONOperands(planQuery);
    },
    getEvents: function(uid, page, pageSize, language, thenFunc, errFunc){
        let userQuery = new ViewQueryModel();
        userQuery.view = 'detailed_user';
        userQuery.JSONFilter = {uid: {[Op.eq] : uid}};
        userQuery.then = function (userData){
            let friendQuery = new QueryJSONModel();
            friendQuery.table = 'friend';
            friendQuery.JSONFilter = {[Op.and] : [{userId : {[Op.eq] : userData[0].id}}, {status : {[Op.eq] : Enums.FriendshipStatus.BeFriend}}]};
            friendQuery.then = function(friends){
                let eventQuery = new ViewQueryModel();
                eventQuery.page = page;
                eventQuery.pageSize = pageSize;
                eventQuery.view = 'detailed_event';
                eventQuery.JSONFilter = { start_date : { [Op.gte] : formattedDate(new Date()) } };
                eventQuery.then = function(events){
                    let eventIds = [];
                    for(let q = 0; q < events.length; q++){
                        eventIds.push(events[q].id);
                        events[q].location = {
                            placeId : events[q].placeId,
                            latitude : events[q].latitude,
                            longitude : events[q].longitude,
                            address : events[q].street + ', ' + events[q].district + ' ' + events[q].country,
                        }
                    }
                    let eventParticipantQuery = new ViewQueryModel();
                    eventParticipantQuery.view = 'detailed_event_participant';
                    eventParticipantQuery.JSONFilter = { event_id : { [Op.in] : eventIds } };
                    eventParticipantQuery.then = function(allParticipants){
                        for(let i = 0; i < events.length; i++){
                            let eventParticipants = allParticipants.filter(function (participant) {
                                if(participant.eventId == events[i].id)
                                    return participant;
                            })
                            events[i].allParticipants = eventParticipants;
                            events[i].commonFriends = [];
                            for(let i = 0; i < eventParticipants; i++){
                                for(let j = 0; j < friends.length; j++){
                                    if(friends[j].id == eventParticipants[i].id){
                                        events[i].commonFriends.push(friends[j]);
                                    }
                                }
                            }
                        }
                        return thenFunc(events);
                    }
                    return ormContainer.SelectViewByQuery(eventParticipantQuery);
                }
                return ormContainer.SelectViewByQuery(eventQuery);
            }
            return ormContainer.SelectByJSONOperands(friendQuery);
        };
        return ormContainer.SelectViewByQuery(userQuery);
    },
    sendComment: function(uid, commentModel, language, thenFunc, errFunc){
        userLogic.getDetailedUser(uid, function(user){
            commentModel.userId = user.id;
            let commentInsert = new InsertModel();
            commentInsert.table = 'comment';
            commentInsert.object = commentModel;
            commentInsert.err = errFunc;
            commentInsert.then = function(data){
                return thenFunc(data);
            }
            return ormContainer.Insert(commentInsert);
        });
    },
    deleteComment: function(commentId, language, thenFunc, errFunc){
        let commentDelete = new DeleteModel();
        commentDelete.table = 'comment';
        commentDelete.err = errFunc;
        commentDelete.where = {id : {[Op.eq] : commentId}};
        commentDelete.then = function(data){
            return thenFunc(data);
        }
        return ormContainer.Delete(commentDelete);
    },
    getMoreComments: function(eventKey, page, pageSize, language, thenFunc, errFunc){
        let commentQuery = new ViewQueryModel();
        commentQuery.view = 'detailed_comment';
        commentQuery.JSONFilter = {plan_id: {[Op.eq] : eventKey}};
        commentQuery.pageSize = pageSize;
        commentQuery.page = page;
        commentQuery.then = function (comments){
            comments = comments.map(function(comment){
                 return {
                     id : comment.id,
                     text : comment.content,
                     uid : comment.uid,
                     owner : {
                         id : comment.userId,
                         uid : comment.uid,
                         firstName : comment.firstName,
                         lastName : comment.lastName,
                         middleName : comment.middleName,
                         photo : comment.photo
                     }
                 }
            });
            return thenFunc(comments);
        }
        return ormContainer.SelectViewByQuery(commentQuery);
    },
    getTimeline: function(uid, page, pageSize, language, thenFunc, errFunc){
        let userQuery = new ViewQueryModel();
        userQuery.view = 'detailed_user';
        userQuery.JSONFilter = {uid: {[Op.eq] : uid}};
        userQuery.then = function (userData){
            let userId = userData[0].id;
            let friendQuery = new QueryJSONModel();
            friendQuery.table = 'friend';
            friendQuery.JSONFilter =  {[Op.and] : [{userId : {[Op.eq] : userId}}, {status : {[Op.eq] : Enums.FriendshipStatus.BeFriend}}]};
            friendQuery.then = function(friends){
                let ownerIds = friends.map(function(friend){
                    return friend.friendUserId;
                })
                ownerIds.push(userId);
                let planQuery = new ViewQueryModel();
                planQuery.view = 'detailed_plan';
                planQuery.JSONFilter = {user_id : { [Op.in] : ownerIds }};
                planQuery.page = page;
                planQuery.pageSize = pageSize;
                planQuery.then = function(plans){
                    let userIds = [];
                    let planIds = [];
                    let eventIds = [];
                    for(let i = 0; i < plans.length; i++)
                    {
                        userIds.push(plans[i].userId);
                        planIds.push(plans[i].id);
                        if(plans[i].eventId != null)
                            eventIds.push(plans[i].eventId);
                    }
                    let detailedUsersQuery = new ViewQueryModel();
                    detailedUsersQuery.view = 'detailed_user';
                    detailedUsersQuery.JSONFilter = {id: {[Op.in] : userIds}};
                    detailedUsersQuery.then = function (userDatas){
                        let commentQuery = new ViewQueryModel();
                        commentQuery.view = 'detailed_comment';
                        commentQuery.JSONFilter = {plan_id: {[Op.in] : planIds}};
                        commentQuery.then = function (comments){
                            let eventQuery = new ViewQueryModel();
                            eventQuery.view = 'detailed_event';
                            eventQuery.JSONFilter = {id: {[Op.in] : eventIds}};
                            eventQuery.then = function (events){
                                let detailedFriendsQuery = new ViewQueryModel();
                                detailedFriendsQuery.view = 'detailed_plan_participant';
                                detailedFriendsQuery.JSONFilter = {plan_id: {[Op.in] : planIds}};
                                detailedFriendsQuery.then = function (friends){
                                    for(let q = 0; q < plans.length; q++){
                                        let curUser = userDatas.filter(function (user) {
                                            return user.id == plans[q].userId;
                                        })[0];
                                        plans[q].owner = curUser;
                                        let participants = [];
                                        let invitedList = [];
                                        friends.filter(function (friend) {
                                            if(friend.planId == plans[q].id && friend.status == Enums.InvitationStatus.Accepted){
                                                participants.push({
                                                    id : friend.id,
                                                    firstName : friend.firstName,
                                                    lastName : friend.lastName,
                                                    middleName : friend.middleName,
                                                    photo : friend.photo,
                                                    uid : friend.uid
                                                });
                                            }
                                            else if (friend.planId == plans[q].id && friend.status == Enums.InvitationStatus.Invited){
                                                invitedList.push({
                                                    id : friend.id,
                                                    firstName : friend.firstName,
                                                    lastName : friend.lastName,
                                                    middleName : friend.middleName,
                                                    photo : friend.photo,
                                                    uid : friend.uid
                                                });
                                            }
                                        });
                                        events.filter(function (event) {
                                            if(event.id == plans[q].eventId) {
                                                plans[q].event = event;
                                                return;
                                            }
                                        });
                                        plans[q].comments = comments.filter(function(comment){
                                            if(comment.planId == plans[q].id)
                                                return {
                                                    id : comment.id,
                                                    text : comment.content,
                                                    uid : comment.uid,
                                                    owner : {
                                                        id : comment.userId,
                                                        uid : comment.uid,
                                                        firstName : comment.firstName,
                                                        lastName : comment.lastName,
                                                        middleName : comment.middleName,
                                                        photo : comment.photo
                                                    }
                                                }
                                        });
                                        plans[q].detailedFriends = participants;
                                        plans[q].invitedUsers = invitedList;
                                    }
                                    return thenFunc(plans);
                                }
                                return ormContainer.SelectViewByQuery(detailedFriendsQuery)
                            }
                            return ormContainer.SelectViewByQuery(eventQuery)
                        }
                        return ormContainer.SelectViewByQuery(commentQuery)
                    }
                    return ormContainer.SelectViewByQuery(detailedUsersQuery)
                }
                return ormContainer.SelectViewByQuery(planQuery)
            }
            return ormContainer.SelectByJSONOperands(friendQuery)
        }
        return ormContainer.SelectViewByQuery(userQuery);
    }
}
aspectLogic.registerMethodTreeOnException(planLogic, 'planLogic');

module.exports = planLogic;