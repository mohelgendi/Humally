let UserModel = require('../logicModels/UserModel.js');
let FriendshipModel = require('../logicModels/FriendshipModel.js');
let DeviceModel = require('../logicModels/DeviceModel.js');
let Enums = require('../logicModels/Enum.js');
let aspectLogic = require('./aspectLogic.js');
const camelcaseKeys = require('camelcase-keys');

let userLogic = {
    getDetailedUser: function(uid, thenFunc, errFunc)
    {
        let query = new ViewQueryModel();
        query.view = 'detailed_user';
        query.JSONFilter = {uid : { [Op.eq] : uid }};
        query.then = function(data){
            return thenFunc(data[0]);
        }
        return ormContainer.SelectViewByQuery(query);
    },

    setCurrentLocation :function(uid, location, language, thenFunc, errFunc)
    {
        return userLogic.getDetailedUser(uid, function(user) {
            location.userId = user.id;
            let insertModel = new InsertModel();
            insertModel.object = location;
            insertModel.table = 'user_location';
            insertModel.then = function(data){
                return thenFunc(data);
            }
            return ormContainer.Insert(insertModel);
        });
    },

    getCheckInPlaceHistory : function(uid, latitude, longitude, thenFunc, errFunc){

        let query = new QueryStringModel();
        query.query = 'select * from detailed_user_location dul where gc_dist(dul.latitude, dul.longitude, '+latitude+', '+longitude+') <= 200 AND dul.uid = \''+ uid +'\'';
        query.then = function(data){
            return thenFunc(camelcaseKeys(data));
        }
        return ormContainer.SelectByQuery(query);
    },

    getFriendsFromLocation :function(latitude, longitude, language, thenFunc, errFunc)
    {
        let query = new QueryStringModel();
        query.query = 'select * from detailed_user_location dul where gc_dist(dul.latitude, dul.longitude, '+latitude+', '+longitude+') <= 200';
        query.then = function(data){
            return thenFunc(camelcaseKeys(data));
        }
        return ormContainer.SelectByQuery(query);
    },

    updateMyProfile: function(uid, userModel, profileModel, thenFunc, errFunc){
        return userLogic.getDetailedUser(uid, function(user) {
            return ormContainer.Transaction(function(tran){
                    let userUpdateModel = new UpdateModel();
                    delete userModel.id;
                    userUpdateModel.object = userModel;
                    userUpdateModel.where = {id : {[Op.eq] : user.id}};
                    userUpdateModel.table = 'user';
                    var thenFunc = function(insertedUser){
                        let userId = insertedUser.id;
                        let profileUpdateModel = new UpdateModel();
                        profileModel.userId = userId;
                        profileModel.id = userId;
                        delete profileModel.id;
                        profileUpdateModel.object = profileModel;
                        profileUpdateModel.where = {user_id : {[Op.eq] : user.id}};
                        profileUpdateModel.table = 'user_profile';
                        profileUpdateModel.then = function(){
                            return true;
                        };
                        return ormContainer.Insert(profileUpdateModel, tran);
                    };
                    userUpdateModel.then = thenFunc;
                    return ormContainer.Insert(userUpdateModel, tran);
                }, function(){
                    let userPart = Object.assign({}, userModel, profileModel);
                    let result = {};
                    result.user = userPart;
                    return thenFunc(result);
                },
                function(err){return errFunc(err.message, HttpStatus.BAD_REQUEST)} )
        })
    },

    getBadgeCount : function(uid, thenFunc, errFunc){
        return userLogic.getDetailedUser(uid, function(user) {
            return thenFunc({notificationBadgeCount : user.notificationBadgeCount, chatBadgeCount : user.chatBadgeCount})
        })
    },

    createUser : function (uid, userModel, profileModel, settingModel, thenFunc, errFunc)
    {
        let authenticationQuery = new QueryJSONModel();
        authenticationQuery.table = 'user_authentication';
        authenticationQuery.JSONFilter = {uid: {[Op.eq] : uid}};
        authenticationQuery.then = function (authenticationData){
            if(authenticationData.length > 0){
                let authId = authenticationData[0].id;
                userModel.userAuthenticationId = authId;
                return ormContainer.Transaction(function(tran){
                    let userInsertModel = new InsertModel();
                    userInsertModel.object = userModel;
                    userInsertModel.table = 'user';
                    var thenFunc = function(insertedUser){
                        let userId = insertedUser.id;
                        let profileInsertModel = new InsertModel();
                        profileModel.userId = userId;
                        profileModel.id = userId;
                        profileInsertModel.object = profileModel;
                        profileInsertModel.table = 'user_profile';
                        profileInsertModel.then = function(){
                            let settingInsertModel = new InsertModel();
                            settingModel.userId = userId;
                            settingInsertModel.object = settingModel;
                            settingInsertModel.table = 'user_setting';
                            settingInsertModel.then = function(){
                                return true;
                            };
                            return ormContainer.Insert(settingInsertModel, tran);
                        };
                        return ormContainer.Insert(profileInsertModel, tran);
                    };
                    userInsertModel.then = thenFunc;
                    return ormContainer.Insert(userInsertModel, tran);
                }, function(){
                    let userPart = Object.assign({}, userModel, profileModel);
                    let result = {};
                    result.user = userPart;
                    result.settings = settingModel;
                    return thenFunc(result);
                    },
                    function(err){return errFunc(err.message, HttpStatus.BAD_REQUEST)} )
            }
            else{
                return errFunc(resourceHelper.Resources.noAuthenticationUserFound, HttpStatus.BAD_REQUEST)
            }
        }
        return ormContainer.SelectByJSONOperands(authenticationQuery);
    },
    setFriendRequest: function(userId, friendId, action, language, thenFunc, errFunc) {
        switch (action){
            case Enums.FriendshipStatus.BeFriend:
                let update = new UpdateModel();
                update.table = 'friend';
                update.object = { status: action, updatedAt: formattedDate((new Date()).valueOf()) }
                update.err = errFunc;
                update.where = {[Op.and]: [{userId : {[Op.eq] : userId}}, {friendUserId : {[Op.eq] : friendId}}]};
                update.then = function (data) {
                    let insert = new InsertModel();
                    insert.table = 'friend';
                    let friendship = new FriendshipModel();
                    friendship.userId = friendId;
                    friendship.status = action;
                    friendship.friendUserId = userId;
                    friendship.updatedAt = formattedDate((new Date()).valueOf());
                    insert.object = friendship;
                    insert.err = errFunc;
                    insert.then = function () {
                        return thenFunc(friendship);
                    }
                    return ormContainer.Insert(insert);
                }
                return ormContainer.Update(update);
                break;
            case Enums.FriendshipStatus.Rejected:
                let deleteQuery = new DeleteModel();
                deleteQuery.table = 'friend';
                deleteQuery.err = errFunc;
                deleteQuery.where = { [Op.or] : [
                        {[Op.and]: [{userId : {[Op.eq] : userId}}, {friendUserId : {[Op.eq] : friendId}}]},
                        {[Op.and]: [{userId : {[Op.eq] : friendId}}, {friendUserId : {[Op.eq] : userId}}]}
                    ]};
                deleteQuery.then = function (data) {
                    return thenFunc(data);
                }
                return ormContainer.Delete(deleteQuery);
                break;
            case Enums.FriendshipStatus.Requested:
                let insert = new InsertModel();
                insert.table = 'friend';
                let friendship = new FriendshipModel();
                friendship.friendUserId = friendId;
                friendship.status = action;
                friendship.userId = userId;
                insert.object = friendship;
                insert.err = errFunc;
                insert.then = function () {
                    return thenFunc(friendship);
                }
                return ormContainer.Insert(insert);
                break;
        }
    },
    /////////////////////////////////////////////////////////////////////////
    stalkUser: function(uid, thenFunc, errFunc){
        return userLogic.getDetailedUser(uid, function(user){
            let plansQuery = new QueryJSONModel();
            plansQuery.table = 'plan_participant';
            plansQuery.JSONFilter = {userId : {[Op.eq] : user.id}};
            plansQuery.then = function(plans){
                console.log('This is the whole fuckin recored', JSON.stringify(plans));
                return thenFunc(plans);
            }
            return ormContainer.SelectByJSONOperands(plansQuery);
        });

        /*let query = new QueryStringModel();//ANOTHER WAY
        query.query =  `select plan_id from plan_participant where user_id=${uid}`;
        query.then = function(data){
            return thenFunc(camelcaseKeys(data));
        }
        return ormContainer.SelectByQuery(query);*/
    },
    ///////////////////////////////////////////////////////////////////////
    getFriendList: function(uid, language, thenFunc, errFunc){
        return userLogic.getDetailedUser(uid, function(user){
            let query = new ViewQueryModel();
            query.view = 'detailed_friend';
            query.JSONFilter = {[Op.and] : [{friend_owner_id : {[Op.eq] : user.id}}, {status : {[Op.eq] : Enums.FriendshipStatus.BeFriend}}]}
            query.then = function(friends){
                for(let q = 0; q < friends.length; q++){
                    let friend = friends[q];
                    friend.commonFriends = friends.filter(function(curFriend){
                        const index = friend.friends.findIndex(item => item.uid === curFriend.uid);
                        if(index > -1)
                            return curFriend;
                    });
                    friend.friends = friend.friends.map(function(curFriend){return curFriend.uid;});
                }
                return thenFunc(friends);
            }
            return ormContainer.SelectViewByQuery(query);
        });
    },
    setRequestStatus: function(uid, receiverId, requestType, requestStatus, language, thenFunc, errFunc){
        return userLogic.getDetailedUser(uid, function(user) {
            return userLogic.getDetailedUser(receiverId, function(receiverUser) {
                if(requestStatus == Enums.PermissionStatus.Requested){
                    let permissionInsert = new InsertModel();
                    permissionInsert.err = errFunc;
                    permissionInsert.object = {
                        userId : receiverUser.id,
                        reqestedUserId : user.id,
                        status : requestStatus,
                        type: requestType
                    }
                    permissionInsert.table = 'permission';
                    permissionInsert.then = function(data){
                        return thenFunc(data);
                    }
                    return ormContainer.Insert(permissionInsert);
                }
                else{
                    let permissionUpdate = new UpdateModel();
                    permissionUpdate.table = 'permission';
                    permissionUpdate.err = errFunc;
                    permissionUpdate.where = {[Op.and] : [
                            {userId : {[Op.eq] : receiverUser.id}},
                            {requestedUserId : {[Op.eq] : user.id}},
                            {type : {[Op.eq] : requestType}}
                        ]};
                    permissionUpdate.object = {status : requestStatus};
                    permissionUpdate.then(function(data){
                        return thenFunc(data);
                    })
                }
            });
        });
    },
    getProfile: function(uid, language, thenFunc, errFunc){
        let result = null;
        let query = new ViewQueryModel();
        query.view = 'detailed_user';
        query.JSONFilter = {uid : { [Op.eq] : uid }};
        query.then = function(data){
            console.log(data.length)
            if(data.length != 0){
                let friendQuery = new ViewQueryModel();
                friendQuery.view = 'detailed_friend';
                friendQuery.JSONFilter = {friend_owner_id : {[Op.eq] : data[0].id}}
                friendQuery.then = function(friends){
                    result = data[0];
                    result.friendList = friends;
                    return thenFunc(result);
                }
                return ormContainer.SelectViewByQuery(friendQuery);
            }
            return errFunc(resourceHelper.Resources.noAuthenticationUserFound, HttpStatus.BAD_REQUEST)
        };
        return ormContainer.SelectViewByQuery(query);
    },
    updateSettigs: function(uid, settings, language, thenFunc, errFunc){
        return userLogic.getDetailedUser(uid, function(user){
            let updateQuery = new UpdateModel();
            updateQuery.table = 'user_setting';
            updateQuery.object = settings;
            updateQuery.where = {userId : {[Op.eq] : user.id}};
            updateQuery.then = function(){
                return thenFunc(settings);
            }
        });
    },
    getSettings: function(uid, language, thenFunc, errFunc){
        return userLogic.getDetailedUser(uid, function(user){
            let settingsQuery = new QueryJSONModel();
            settingsQuery.table = 'user_setting';
            settingsQuery.JSONFilter = {userId : {[Op.eq] : user.id}};
            settingsQuery.page = 0;
            settingsQuery.pageSize = 1;
            settingsQuery.then = function(settings){
                console.log('asdsada', settings)
                let curSetting = settings[0];
                let setting = {
                    whoCanContactMe: curSetting.whoCanContactMe,
                    language: curSetting.language,
                    notificationSettings: {
                        messages: curSetting.messagesNotif,
                        friendRequests: curSetting.friendrequestsNotif,
                        invites: curSetting.invitesNotif,
                        joined: curSetting.joinedNotif,
                        comments: curSetting.commentNotif
                    }
                };
                return thenFunc(setting);
            }
            return ormContainer.SelectByJSONOperands(settingsQuery);
        });
    },
    disableUser: function(uid, language, thenFunc, errFunc){
        let disableUserQuery = new UpdateModel();
        disableUserQuery.table = 'user_authentication';
        disableUserQuery.where = {uid : {[Op.eq] : uid}};
        disableUserQuery.object = { disabled : true };
        disableUserQuery.err = errFunc;
        disableUserQuery.then = function(data){
            return thenFunc(data);
        }
        return ormContainer.Update(disableUserQuery);
    },
    registerDevice: function(uid, deviceModel = new DeviceModel(), language, thenFunc, errFunc){
        let query = new ViewQueryModel();
        query.view = 'detailed_user';
        query.JSONFilter = {uid : { [Op.eq] : uid }};
        query.then = function(data){
            if(data.length>0){
                let detailed_user = data[0];
                let registerIUModel = new InsertOrUpdateModel();
                deviceModel.userId = detailed_user.id;
                if(detailed_user.deviceType != undefined && detailed_user.deviceType != null){
                    deviceModel.id = detailed_user.fcmDeviceId;
                    deviceModel.updatedAt = formattedDate(moment.utc().valueOf());
                }
                registerIUModel.object = deviceModel;
                registerIUModel.table = 'fcm_device';
                registerIUModel.err = errFunc;
                let thenIUFunc = function(device){
                    return thenFunc(device);
                }
                registerIUModel.then = thenIUFunc;
                return ormContainer.InsertOrUpdate(registerIUModel);
            }
            return errFunc(resourceHelper.Resources.noAuthenticationUserFound, HttpStatus.BAD_REQUEST);
        }
        return ormContainer.SelectViewByQuery(query);
    }
}
aspectLogic.registerMethodTreeOnException(userLogic, 'userLogic');
module.exports = userLogic;



