let UserProfileModel = require('../logicModels/UserProfileModel.js');
let UserModel = require('../logicModels/UserModel.js');
let UserSettingModel = require('../logicModels/UserSettingModel.js');
let DeviceModel = require('../logicModels/DeviceModel.js');
let LocationModel = require('../logicModels/LocationModel.js');
let searchLogic = require('../logic/searchLogic.js');
let logLogic = require('../logic/logLogic.js');

var app;
const constants = require('../constants/constants');
let HttpStatus = constants.HttpStatus;
module.exports = function (application) {
    app = application;
    app.get('/getLog', function (request, response) {
        validateToken(request, response, function () {
            var newLog = request.query;
            logLogic.getLog(newLog.type, newLog.keyword, newLog.page, newLog.pageSize, function (data) {
                return prepareResponseResult(request, response, HttpStatus.OK, data);
            }, function (message, code) {
                return prepareResponseResult(request, response, code, null, message);
            })
        })
    })
}