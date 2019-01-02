let PlanModel = require('../logicModels/PlanModel.js');
let NotificationModel = require('../logicModels/NotificationModel.js');
let PlanParticipantModel = require('../logicModels/PlanParticipantModel.js');
let Enums = require('../logicModels/Enum.js');
let aspect = require('aspect-js');
const constants = require('../constants/constants');
let logLogic = require('./logLogic.js');
let HttpStatus = constants.HttpStatus;

let aspectLogic = {
    registerMethodTreeOnException: function(contextObject, contextName){
        let methodNames = Object.keys(contextObject);
        for(let q = 0; q < methodNames.length; q++){
            aspect.afterThrow(contextObject, methodNames[q], function (err, errFunc) {
                var undeclaredArgs = [].slice.call(arguments, arguments.callee.length);
                console.log('full error : ', err)
                console.log(contextName + '.' + methodNames[q] + ' has thrown: ' + err.message);
                logLogic.addLog(Enums.LogType.Error,`${contextName}.${methodNames[q]}`, err.message);
                return undeclaredArgs[undeclaredArgs.length-1](contextName + '.' + methodNames[q] + ' has thrown: ' + err.message, HttpStatus.BAD_REQUEST);
            });
        }
    }
}

module.exports = aspectLogic;
