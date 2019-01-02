let PlanModel = require('../logicModels/PlanModel.js');
let CommentModel = require('../logicModels/CommentModel.js');
let EventParticipantModel = require('../logicModels/EventParticipantModel.js');
let planLogic = require('../logic/planLogic.js');
let eventLogic = require('../logic/eventLogic.js');
let Enums = require('../logicModels/Enum.js');

var app;
const constants = require('../constants/constants');
let HttpStatus = constants.HttpStatus;
let planControllerHelper = {
    preparePlanModel : function(request){
        let plan = request.body;
        let planModel = new PlanModel();
        planModel.id = plan.planKey;
        if(plan.invitedUsers != undefined) planModel.invitedUsers = plan.invitedUsers;
        planModel.category = plan.category;
        planModel.subCategory = plan.subCategory;
        planModel.checkInPlace = plan.checkInPlace;
        planModel.location = plan.location;
        planModel.note = plan.note;
        planModel.profileType = Enums.ProfileType.Private;
        planModel.startTime = formattedDate(plan.start);
        planModel.endTime = formattedDate(plan.end);
        planModel.media = plan.media;
        return planModel;
    }
}
module.exports = function(application){
    app = application;
    app.post('/setPlan', function(request, response){
        validateToken(request, response, function(){
            let planModel = planControllerHelper.preparePlanModel(request);
            planLogic.setPlan(request.user.uid, planModel, request.headers.lang,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                }
            );
        })
    });
    app.post('/removePlan', function(request, response){
        let planModel = planControllerHelper.preparePlanModel(request);
        validateToken(request, response, function(){
            let planModel = planControllerHelper.preparePlanModel(request);
            planLogic.removePlan(request.body.myScheduleItemKey, request.user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                }
            );
        })
    });
    app.get('/getEvents', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            planLogic.getEvents(user.uid, request.query.page, request.query.pageSize, user.language, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data)
            },
            function(message, code){
                return prepareResponseResult(request, response, code, message, message)
            })
        })
    });
    app.post('/participateEvent', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            let participant = new EventParticipantModel();
            participant.eventKey = request.body.event != undefined ? request.body.event.id + '' : request.body.eventKey + '';
            participant.interactionType = request.body.interested != undefined && request.body.interested == true ? 'interested' : 'joined';
            participant.planKey = request.body.planKey;
            participant.uid = user.uid;
            eventLogic.participateEvent(participant, user.language,
                function(data){

                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
            });
        })
    })
    app.get('/getTimeline', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            console.log(request.query)
            planLogic.getTimeline(user.uid, request.query.page, request.query.pageSize, user.language, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data);
            }, function(message, code){
                return prepareResponseResult(request, response, code, message, message)
            });
        })
    });
    app.get('/getMoreComment', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            planLogic.getMoreComments(request.query.eventKey, request.query.page, request.query.pageSize, user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                })
        })
    });
    app.get('/sendComment', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            const comment = request.query.comment;
            const eventKey = request.query.eventKey;
            let commentModel = new CommentModel();
            commentModel.content = comment;
            commentModel.planId = eventKey;
            planLogic.sendComment(user.uid, commentModel, user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                })
        })
    });
    app.get('/setInvitationStatus', function(request, response){
        validateToken(request, response, function() {
            let status = request.query.status;
            let eventKey = request.query.eventKey;
            let user = request.user;
            let profileId = request.query.profileId != undefined ? request.query.profileId : user.uid;
            planLogic.setInvitationStatus(profileId, eventKey, status, user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                })
        });
    });
    app.get('/deleteComment', function(request, response){
        validateToken(request, response, function() {
            let commentKey = request.query.commentKey;
            let user = request.user;
            planLogic.deleteComment(commentKey, user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                })
        })
    });
    app.get('/getPlan', function(request, response){
        validateToken(request, response, function(){
            planLogic.getPlan(request.query.key, request.user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                }
            );
        })
    });
}

