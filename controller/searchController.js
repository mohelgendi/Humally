let UserProfileModel = require('../logicModels/UserProfileModel.js');
let UserModel = require('../logicModels/UserModel.js');
let UserSettingModel = require('../logicModels/UserSettingModel.js');
let DeviceModel = require('../logicModels/DeviceModel.js');
let LocationModel = require('../logicModels/LocationModel.js');
let searchLogic = require('../logic/searchLogic.js');
userController.js
var app;
const constants = require('../constants/constants');
let HttpStatus = constants.HttpStatus;
module.exports = function(application){
    app = application;
    app.get('/findUsers',function(request, response){
        validateToken(request, response, function() {
            let user = request.user;
            searchLogic.findUsers(user.uid,  request.query.keyword, request.user.language, function(result){
                return prepareResponseResult(request, response, HttpStatus.OK, result)
            }, function(message, code){
                return prepareResponseResult(request, response, code, message, message);
            })
        })
    })

}

