let UserProfileModel = require('../logicModels/UserProfileModel.js');
let UserModel = require('../logicModels/UserModel.js');
let UserSettingModel = require('../logicModels/UserSettingModel.js');
let DeviceModel = require('../logicModels/DeviceModel.js');
let LocationModel = require('../logicModels/LocationModel.js');
let userLogic = require('../logic/userLogic.js');

var app;
const constants = require('../constants/constants');
let HttpStatus = constants.HttpStatus;
module.exports = function(application){
    app = application;
    app.post('/registerDevice', function(request, response){
        validateToken(request, response, () => {
            let user = request.user;
            let token = request.body.token;
            let deviceType = request.body.deviceType != undefined ? request.body.deviceType : 'ios';
            let deviceModel = new DeviceModel();
            deviceModel.deviceType = deviceType;
            deviceModel.token = token;
            userLogic.registerDevice(user.uid, deviceModel, user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                }
            );
        });
    })

    app.post('/createUser', function(request, response){
        validateToken(request, response, function(){
            let user = new UserModel();
            let profile = new UserProfileModel();
            let settings = new UserSettingModel();
            settings.language = request.body.deviceLanguage;
            user.firstName = request.body.firstName;
            user.lastName = request.body.lastName;
            user.gender = request.body.gender;
            user.dateOfBirth = formattedDate(request.body.dateOfBirth);
            user.language = request.body.deviceLanguage;
            user.phoneNumber = request.body.phoneNumber;
            user.email = request.body.email;
            profile.photo = request.body.photoURL;
            userLogic.createUser(request.user.uid, user, profile, settings,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                }
            );
        })
    })

    app.post('/updateMyProfile', function(request, response){
        validateToken(request, response, function(){
            let user = new UserModel();
            let profile = new UserProfileModel();
            user.bio = request.body.bio;
            user.country = request.body.country;
            user.dateOfBirth = formattedDate(request.body.dateOfBirth);
            user.description = request.body.description;
            user.email = request.body.email;
            user.firstName = request.body.firstName;
            user.language = request.body.language;
            user.middleName = request.body.middleName;
            user.livingAddress = request.body.livingAddress;
            user.loggedInBefore = request.body.loggedInBefore;
            user.relationship = request.body.relationship;
            user.sexualOrientation = request.body.sexualOrientation;
            user.phoneNumber = request.body.phoneNumber;

            profile.photo = request.body.photoURL;
            profile.coverPhoto = request.body.coverPhoto;
            profile.educations = request.body.educations;
            profile.interests = request.body.interests;
            profile.jobs = request.body.jobs;

            userLogic.updateMyProfile(request.user.uid, user, profile,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code){
                    return prepareResponseResult(request, response, code, message, message)
                }
            );
        })
    })

    app.get('/getProfile',function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            let profileId = request.query.profileId != undefined ? request.query.profileId : request.user.uid;
            userLogic.getProfile(profileId,  request.user.language, function(result){
                return prepareResponseResult(request, response, HttpStatus.OK, result)
            }, function(message, code){
                return prepareResponseResult(request, response, code, message, message);
            })
        })
    })

    app.get('/getFriendList',function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            let profileId = request.query.profileId != undefined ? request.query.profileId : request.user.uid;
            userLogic.getFriendList(profileId,  request.user.language, function(result){
                return prepareResponseResult(request, response, HttpStatus.OK, result)
            }, function(message, code){
                return prepareResponseResult(request, response, code, message, message);
            })
        })
    })
    app.post('/deleteUser', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            userLogic.disableUser(user.uid, user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code) {
                    return prepareResponseResult(request, response, code, message, message);
                });
        })
    })
    app.post('/setRequestStatus', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            let requestType = request.body.requestType;
            let requestStatus = request.body.requestStatus;
            let receiverId = request.body.receiverId;
            userLogic.setRequestStatus(user.uid, receiverId, requestType, requestStatus, user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code) {
                    return prepareResponseResult(request, response, code, message, message);
                });
        })
    })
    app.post('/updateSettings', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            let settings = request.body.settings;
            let settingsModel = new UserSettingModel();
            settingsModel.language = settings.language;
            settingsModel.commentNotif = settings.notificationSettings.comments;
            settingsModel.friendrequestsNotif = settings.notificationSettings.friendRequests;
            settingsModel.invitesNotif = settings.notificationSettings.invites;
            settingsModel.joinedNotif = settings.notificationSettings.joined;
            settingsModel.messagesNotif = settings.notificationSettings.messages;
            settingsModel.whoCanContactMe = settings.whoCanContactMe;
            userLogic.updateSettigs(user.uid, settingsModel, user.language, function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code) {
                    return prepareResponseResult(request, response, code, message, message);
                });
        })
    })
    app.get('/getSettings', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            let profileId = request.query.profileId != undefined ? request.query.profileId : user.uid;
            userLogic.getSettings(profileId, user.language, function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code) {
                    return prepareResponseResult(request, response, code, message, message);
                });
        });
    })
    /////////////////////////////////////////////////////////////////
    /*app.get('/stalkUser',function(request, response){
        validateToken(request, response, function() {
            userLogic.stalkUser(request.query.uid, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data);
            }, function (message, code) {
                return prepareResponseResult(request, response, code, null, message);
            })
        })
    })*/
    app.get('/stalkUser',function(request, response){
        validateToken(request, response, function() {//This function is intentionally broken
            userLogic.stalkUser(request.query/*.uid*/, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data);
            }, function (message, code) {
                return prepareResponseResult(request, response, code, null, message);
            })
        })
    })
    //////////////////////////////////////////////////////////////////
    app.get('/getFriendList', function(request,response){
        validateToken(request, response, function() {
            let user = request.user;
            let profileId = request.query.profileId != undefined ? request.query.profileId : user.uid;
            userLogic.getFriendList(profileId, user.language, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data)
            },
            function(message, code) {
                return prepareResponseResult(request, response, code, message, message);
            });
        });
    })

    app.post('/setCurrentLocation', function(request, response){
        validateToken(request, response, function() {
            let location = new LocationModel();
            location.latitude = request.body.latitude;
            location.longitude = request.body.latitude;
            userLogic.setCurrentLocation(request.user.uid, location, request.user.language, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data);
            }, function (message, code) {
                return prepareResponseResult(request, response, code, null, message);
            })
        })
    })

    app.get('/getFriendsFromLocation', function(request, response){
        validateToken(request, response, function() {
            let location = new LocationModel();
            location.latitude = request.body.latitude;
            location.longitude = request.body.latitude;
            userLogic.getFriendsFromLocation(request.query.latitude, request.query.longitude, request.user.language, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data);
            }, function (message, code) {
                return prepareResponseResult(request, response, code, null, message);
            })
        })
    })

    app.get('/getCheckInPlaceHistory', function(request, response){
        validateToken(request, response, function() {
            let location = new LocationModel();
            location.latitude = request.body.latitude;
            location.longitude = request.body.latitude;
            userLogic.getCheckInPlaceHistory(request.user.uid, request.query.latitude, request.query.longitude, request.user.language, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data);
            }, function (message, code) {
                return prepareResponseResult(request, response, code, null, message);
            })
        })
    })

    app.get('/getBadgeCount', function(request, response){
        validateToken(request, response, function() {
            userLogic.getBadgeCount(request.user.uid, function(data){
                return prepareResponseResult(request, response, HttpStatus.OK, data)
            }, function (message, code) {
                return prepareResponseResult(request, response, code, null, message);
            })
        })
    })

    app.post('/setFriendRequest', function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            userLogic.setFriendRequest(request.body.userId, request.body.friendId, request.body.action, user.language,
                function(data){
                    return prepareResponseResult(request, response, HttpStatus.OK, data)
                },
                function(message, code) {
                    return prepareResponseResult(request, response, code, null, message);
                });
        })
    })
}

