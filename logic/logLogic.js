let UserModel = require('../logicModels/UserModel.js');
let DeviceModel = require('../logicModels/DeviceModel.js');
let Enums = require('../logicModels/Enum.js');
let userLogic = require('./userLogic.js');

const camelcaseKeys = require('camelcase-keys');

let logLogic = {
    getLog: function (type, keyword, page, pageSize, thenFunc, errFunc) {
        let logsQuery = new QueryJSONModel();
        console.log(`\n\nType:${type} Keyword:${keyword}\n\n`)
        logsQuery.table = 'log';
        logsQuery.page = page;//Page val. should be specified 
        logsQuery.pageSize = pageSize;//PageSize val. should be specified 
        if (type != "" && keyword != "") {
            logsQuery.JSONFilter = { [Op.or]: [{ type: { [Op.eq]: type } }, { detail: { [Op.like]: '%' + keyword + '%' } }] };
        } else if (type != "") {
            logsQuery.JSONFilter = { type: { [Op.eq]: type } };
        } else {
            logsQuery.JSONFilter = { detail: { [Op.like]: '%' + keyword + '%' } };
        }

        logsQuery.then = function (logs) {
            return thenFunc(logs);
        }
        return ormContainer.SelectByJSONOperands(logsQuery);
    },
    addLog: function (type, method, detail, thenFunc, errFunc) {
        let log = new InsertModel()
        log.err = errFunc;
        log.table = 'log';
        log.object = {
            type: type,
            method: method,
            detail: detail
        }
        log.then = function (data) {
            return thenFunc(data);
        }
        return ormContainer.Insert(log);
    },
    addError: function (method, detail, thenFunc, errFunc) {
        /////
        logLogic.addLog(Enums.LogType.Error, method, detail);
    },
    adInfo: function (method, detail, thenFunc, errFunc) {
        ////
        logLogic.addLog(Enums.LogType.Error, method, detail);
    },
    addWarning: function (method, detail, thenFunc, errFunc) {
        //////
        logLogic.addLog(Enums.LogType.Error, method, detail);
    }
}
module.exports = logLogic;