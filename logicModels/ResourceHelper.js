let ResourceHelper = {
    Resources : {
        noAuthenticationUserFound : 1,
        noPlanFound : 2
    },
    translate : function(id, language){
        return global._resourceCache[id + '_' + language];
    },
    register : function(){
        global._resourceCache = {};
        let authenticationQuery = new QueryJSONModel();
        authenticationQuery.table = 'resource_value';
        authenticationQuery.then = function (resourceValues){
            for(let q = 0; q < resourceValues.length; q++){
                global._resourceCache[resourceValues[q].keyId + '_' + resourceValues[q].languageCode] = resourceValues[q].resourceValue;
            }
        }
        return ormContainer.SelectByJSONOperands(authenticationQuery);
    }
};
Object.freeze(ResourceHelper.Resources);
module.exports = ResourceHelper;


