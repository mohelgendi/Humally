global.fetch = require('node-fetch')
let encKey = 'PKGMhHHmwHwq2nQFATKYPyg7WmxZCETHGVUa6cufAu9jkkbW';
var crypto = require('crypto');
var algorithm = 'aes256';
var encSep = '_____';
var cachedTokens = {};
let moment = require('moment');

module.exports = function() {
    let authenticationContainer = {};
    function getToken(userId, secret, thenFunc, errFunc){
        let dateVal = moment().toDate();
        let authFunc = function () {
            if(secret == undefined) return errFunc('Unauthorized');

            let query = new QueryJSONModel()
            query.table = 'user_authentication';
            query.JSONFilter = {
                [Op.and] :[
                    {uid: {[Op.eq] : userId}},
                    {secret: {[Op.eq] : secret}}
                    ]
            };
            query.then = function(data){
                if(data.length>0){
                    cachedTokens[userId + secret] = [];
                    if(data[0].tokenTime.valueOf() <= dateVal.addDays(-1).valueOf()){
                        let updateModel1 = new UpdateModel();
                        let token = guid();
                        let cipher = crypto.createCipher(algorithm, encKey);
                        token = cipher.update(userId + encSep + token + encSep + secret, 'utf8', 'hex') + cipher.final('hex');
                        let tokenTime = formattedDate(moment().toDate().valueOf());
                        updateModel1.object = { token : token, tokenTime : tokenTime};
                        updateModel1.table = 'user_authentication';
                        updateModel1.where = {uid: {[Op.eq] : userId}};
                        updateModel1.then = function(){
                            cachedTokens[userId + secret].push({token : token, tokenTime : tokenTime })
                            return thenFunc(token);
                        }
                        return ormContainer.Update(updateModel1);
                    }else{
                        cachedTokens[userId + secret].push({token : data[0].token, tokenTime : data[0].tokenTime })
                        console.log(cachedTokens);
                        return thenFunc(data[0].token);
                    }
                }
                return errFunc('Unauthorized');
            }
            return ormContainer.SelectByJSONOperands(query);
        }
        if(cachedTokens[userId + secret] != undefined  && cachedTokens[userId + secret].length > 0 &&
            cachedTokens[userId + secret][cachedTokens[userId + secret].length-1].tokenTime.valueOf() >= dateVal.addDays(-1).valueOf()){
            console.log('fromCache')
            return thenFunc(cachedTokens[userId + secret][cachedTokens[userId + secret].length-1].token);
        }
        else{
            console.log('fromServer')
            return authFunc();
        }
    }

     function isUserDisabled(phone){
        let query = new QueryJSONModel();
        query.table = 'user_authentication';
        query.JSONFilter = {[Op.and] : [{phone_number: {[Op.eq] : phone}}, {disabled: {[Op.eq] : false}}]};
        query.then = function(data){
            console.log(data)
            if(data.length > 0) {
                return true;
            }
            return false;
        };
        return ormContainer.SelectByJSONOperands(query);
    }

    function revokeUser(uid){
        let updateModel = new UpdateModel();
        updateModel.object = { disabled:false};
        updateModel.table = 'user_authentication';
        updateModel.where = {uid: {[Op.eq] : uid}};
        updateModel.then = function(){
            return true;
        }
        return ormContainer.Update(updateModel);
    }

    function registerUser(userId, phoneNumber, thenFunc, errFunc){
        try{
            let secret = guid();
            let resultData = {};
            let query = new QueryJSONModel();
            query.table = 'user_authentication';
            query.JSONFilter = {phoneNumber: {[Op.eq] : phoneNumber}};
            query.then = function(data){
                if(data.length == 0){
                    let insertFirstModel = new InsertModel();
                    let token = guid();
                    let cipher = crypto.createCipher(algorithm, encKey);
                    token = cipher.update(userId + encSep + token + encSep + secret, 'utf8', 'hex') + cipher.final('hex');
                    insertFirstModel.object = {
                        uid : userId,
                        secret : secret,
                        token : token,
                        phoneNumber: phoneNumber,
                        extraContent : '{}',
                        tokenTime : formattedDate(moment().toDate().valueOf()),
                        registryTime : formattedDate(moment().toDate().valueOf())
                    };
                    insertFirstModel.table = 'user_authentication';
                    insertFirstModel.then =  function(){
                        resultData = { uid : userId, token : token, secret : secret};
                        if(thenFunc != undefined) return thenFunc(null, resultData);
                        return true;
                    };
                    return ormContainer.Insert(insertFirstModel);
                }
                else{
                    let updateModel1 = new UpdateModel();
                    let token = guid();
                    let cipher = crypto.createCipher(algorithm, encKey);
                    token = cipher.update(data[0].uid + encSep + token + encSep + data[0].secret, 'utf8', 'hex') + cipher.final('hex');
                    let tokenTime = formattedDate(moment().toDate().valueOf());
                    updateModel1.object = { token : token, tokenTime : tokenTime, disabled : false};
                    updateModel1.table = 'user_authentication';
                    updateModel1.where = {uid: {[Op.eq] : data[0].uid}};
                    updateModel1.then = function(){
                        if(cachedTokens[data[0].uid + data[0].secret] != undefined) delete cachedTokens[data[0].uid + data[0].secret];
                        resultData = { uid : data[0].uid, token : token, secret : data[0].secret};
                        console.log(thenFunc)
                        if(thenFunc != undefined) return thenFunc(null, resultData);
                        return true;
                    }
                    return ormContainer.Update(updateModel1);
                }
            }
            return ormContainer.SelectByJSONOperands(query);
        }catch(e){
            if(errFunc != undefined) return errFunc(e);
        }
    }

    function disableUser(token, thenFunc){
        let decipher = crypto.createDecipher(algorithm, encKey);
        let decrypted = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
        let params = decrypted.split(encSep);
        let userId = params[0];
        let secret = params[2];
        delete cachedTokens[userId + secret];
        let updateModel1 = new UpdateModel();
        updateModel1.object = { disabled : true, token : null };
        updateModel1.table = 'user_authentication';
        updateModel1.where = {uid: {[Op.eq] : userId}};
        updateModel1.then = function(){
            return thenFunc();
        }
        return ormContainer.Update(updateModel1);
    }

    function validateToken(requestx, token, context){
        let decipher = crypto.createDecipher(algorithm, encKey);
        let params =[];
        try{
            let decrypted = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
            params = decrypted.split(encSep);
        }catch(e){
            return context("Unauthorized");
        }
        if(params.length != 3){
            return context("Unauthorized");
        }
        let dateVal = moment().toDate();
        let userId = params[0];
        let secret = params[2];
        if(requestx != null) requestx.user = { uid:userId, language : requestx.headers.language != undefined ? requestx.headers.language : 'en' };
        if(cachedTokens[userId + secret] != undefined  && cachedTokens[userId + secret].length > 0 &&
            cachedTokens[userId + secret][cachedTokens[userId + secret].length-1].tokenTime.valueOf() >= dateVal.addDays(-1).valueOf()
        ){
            console.log('fromCache')
            if(token == cachedTokens[userId + secret][cachedTokens[userId + secret].length-1].token)
                return context('Authorized');
            return context('Unauthorized');
        }

        let query = new QueryJSONModel()
        query.table = 'user_authentication';
        query.JSONFilter = {
            [Op.and] :[
                {uid: {[Op.eq] : userId}},
                {secret: {[Op.eq] : secret}},
                {token: {[Op.eq] : token}}
            ]
        };
        query.then = function(data){
            if(data.length>0){
                if(data[0].tokenTime >= dateVal.addDays(-1).valueOf()){
                    cachedTokens[userId + secret] = [];
                    cachedTokens[userId + secret].push({token : token, tokenTime : data[0].tokenTime })
                    return context('Authorized');
                }else{
                    return context('Unauthorized');
                }
            }
            return context('Unauthorized');
        }
        return ormContainer.SelectByJSONOperands(query);
    }

    function replaceToken(request, thenFunc, errFunc){
        let uid = request.user.uid;
        let query = new QueryJSONModel()
        query.table = 'user_authentication';
        query.JSONFilter = {uid: {[Op.eq] : uid}};
        query.then = function(data){
            if(data.length>0){
                return getToken(data[0].uid, data[0].secret, function(token){
                    return thenFunc({ token : token, secret : data[0].secret});
                },function(err){
                    return errFunc(err);
                })
            }
            return errFunc('Unauthorized');
        }
        return ormContainer.SelectByJSONOperands(query);
    }
    authenticationContainer.isUserDisabled = isUserDisabled;
    authenticationContainer.revokeUser = revokeUser;
    authenticationContainer.replaceToken = replaceToken;
    authenticationContainer.disableUser = disableUser;
    authenticationContainer.registerUser = registerUser;
    authenticationContainer.validateToken = validateToken;
    authenticationContainer.getToken = getToken;
    return authenticationContainer;
}

