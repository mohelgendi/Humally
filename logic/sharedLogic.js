let UserModel = require('../logicModels/UserModel.js');
let DeviceModel = require('../logicModels/DeviceModel.js');
let Enums = require('../logicModels/Enum.js');
let aspectLogic = require('./aspectLogic.js');
let userLogic = require('./userLogic.js');

let privateFunctions = {
    isPrimitive : function (test) {
        return (test !== Object(test));
    }
}

let sharedLogic = {

    setNotification : function(notification, language, thenFunc, errFunc){
        userLogic.getDetailedUser(uid, function(user){
            let notifQuery = new UpdateModel();
            notifQuery.table = 'notification';
            notifQuery.where = {id : {[Op.eq] : notification.id}};
            notifQuery.object = {read : notification.isRead};
            notifQuery.then = function(data){
                return thenFunc(data);
            }
            return ormContainer.SelectViewByQuery(notifQuery);
        });
    },
    getNotifications : function(uid, page, pageSize, language, thenFunc, errFunc){
        userLogic.getDetailedUser(uid, function(user){
            let notifQuery = new ViewQueryModel();
            notifQuery.view = 'detailed_notification';
            notifQuery.JSONFilter = {user_identifier : {[Op.eq] : user.id}};
            notifQuery.page = page;
            notifQuery.pageSize = pageSize;
            notifQuery.orderBy = 'create_date';
            notifQuery.then = function(data){
                return thenFunc(data);
            }
            return ormContainer.SelectViewByQuery(notifQuery);
        });
    },
    getPhotoDirection : function(photoType, uid, eventKey){
        const photoLocation = !Enums.PhotoLocations[photoType] ? Enums.PhotoLocations.UPLOAD : Enums.PhotoLocations[photoType];
        let photosDir;
        switch (photoType) {
            case Enums.PhotoTypes.POST:
                photosDir = path.join(photoLocation, uid, eventKey);
                break;
            case Enums.PhotoTypes.PROFILE:
                photosDir = path.join(photoLocation, uid);
                break;
            case Enums.PhotoTypes.PHOTOS:
                photosDir = path.join(photoLocation, uid);
                break;
            case Enums.PhotoTypes.COVER:
                photosDir = path.join(photoLocation, uid);
                break;
            case Enums.PhotoTypes.OTHERS:
                photosDir = path.join(photoLocation, uid);
                break;
            default:
                photosDir = userUid ? path.join(photoLocation, uid) : path.join(photoLocation);
                break;
        }
        return photosDir;
    },
    getTableContent: function(dbObjectName, filter, thenFunc){
        let query = new helper.QueryJSONModel();
        query.table = 'tColleague';
        query.JSONFilter = filter;
        query.then = function(data){
            return thenFunc(data);
        }
        return ormContainer.SelectByJSONOperands(query);
    },
    getTableMeta: function(dbObjectName, thenFunc){
        let queryCommercial = new QueryStringModel();
        queryCommercial.query = 'SELECT column_name, data_type\n' +
            'FROM information_schema.columns\n' +
            'WHERE table_name   = \'' + dbObjectName + '\'';
        queryCommercial.then = function(data){
            if(data.length > 0)
                return thenFunc(data[0]);
            return thenFunc(null);
        }
        return ormContainer.SelectByQuery(queryCommercial);
    },
    switchTocamelCase : function(object){
        let result;
        if(result == null || result == undefined) return result;
        else if(privateFunctions.isPrimitive(object))
            return object;
        if(Array.isArray(object)){
            result = [];
            for(let q = 0; q < object.length; q++){
                result.push(_.mapKeys(object[q], _.rearg(_.camelCase, 1)))
            }
        }
        else{
            result = _.mapKeys(object, _.rearg(_.camelCase, 1));
        }
        return result;
    }
}
aspectLogic.registerMethodTreeOnException(sharedLogic, 'sharedLogic');

module.exports = sharedLogic;