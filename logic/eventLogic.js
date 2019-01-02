let PlanModel = require('../logicModels/PlanModel.js');
let NotificationModel = require('../logicModels/NotificationModel.js');
let PlanParticipantModel = require('../logicModels/PlanParticipantModel.js');
let Enums = require('../logicModels/Enum.js');
let aspectLogic = require('./aspectLogic.js');
let sharedLogic = require('./sharedLogic.js');
let userLogic = require('./userLogic.js');
let planLogic = require('./planLogic.js');

let eventLogic = {
    participateEvent : function(eventParticipant, language, thenFunc, errFunc){
        userLogic.getDetailedUser(eventParticipant.uid, function(user) {

            let participantFunc = function(){
                let planParticipant = new InsertModel()
                planParticipant.err = errFunc;
                planParticipant.table = 'plan_participant';
                planParticipant.object = {
                    userId : user.id,
                    planId : eventParticipant.planKey,
                    status : Enums.InvitationStatus.Accepted
                }
                planParticipant.then = function(data){
                    return thenFunc(data)
                }
                return ormContainer.Insert(planParticipant);
            }

            if(eventParticipant.planKey == undefined){
                let eventQuery = new QueryJSONModel();
                eventQuery.table = 'event';
                eventQuery.JSONFilter = {id : {[Op.eq] : eventParticipant.eventKey}}
                eventQuery.page = 0;
                eventQuery.pageSize = 1;
                eventQuery.then = function(events){
                    if(events.length > 0){
                        let event = events[0];
                        let planModel = new PlanModel();
                        let invitedUsers = [];
                        invitedUsers.push(user.id)
                        planModel.invitedUsers = invitedUsers;
                        planModel.category = 'DayOut';
                        planModel.subCategory = 'culture';
                        planModel.location = event.location;
                        planModel.eventId = event.id;
                        planModel.profileType = Enums.ProfileType.Private;
                        planModel.startTime = formattedDate(event.startDate);
                        planModel.endTime = formattedDate(event.endDate);
                        planModel.media = [];
                        planModel.media.push(event.photoURL);
                        planLogic.setPlan(eventParticipant.uid, planModel, language,
                            function(data){
                                return thenFunc(data);
                            },
                            errFunc
                        );
                    }
                    return errFunc(resourceHelper.Resources.noPlanFound, HttpStatus.BAD_REQUEST);
                }
                return ormContainer.SelectByJSONOperands(eventQuery);
            }
            else{
                return participantFunc();
            }
        })
    }
}
aspectLogic.registerMethodTreeOnException(eventLogic, 'eventLogic');

module.exports = eventLogic;