let UserModel = require('../logicModels/UserModel.js');
let DeviceModel = require('../logicModels/DeviceModel.js');
let Enums = require('../logicModels/Enum.js');
let aspectLogic = require('./aspectLogic.js');
let userLogic = require('./userLogic.js');

const camelcaseKeys = require('camelcase-keys');

let searchLogic = {
    findUsers : function(uid, keyword, language, thenFunc, errFunc){
        let query = new QueryStringModel();
        query.query = 'select * from detailed_user du where du.first_name || \' \' || du.last_name like \'%' + keyword + '%\' ORDER BY du.id LIMIT 30 OFFSET 0 ';
        query.then = function(data){
            return thenFunc(camelcaseKeys(data));
        }
        return ormContainer.SelectByQuery(query);
    }
}
aspectLogic.registerMethodTreeOnException(searchLogic, 'searchLogic');

module.exports = searchLogic;