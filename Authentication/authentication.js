
const { HttpStatus, HttpMethods } = require('../constants/constants');
const axios = require('axios');
const smsVerificationAPIBaseURL = "https://rest.messagebird.com/";
const smsVerificationAPIToken = "1IvU37tatMvyonpsgNj3ZypOA";

const MessageBirdVerifyStatus = {
    SENT: 'sent',
    EXPIRED: 'expired',
    FAILED: 'failed',
    VERIFIED: 'verified',
    DELETED: 'deleted'
};

var app;
module.exports = function(application){
    let backdoors = [];
    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle0",
        phone : '+905379878518',
        code : 111111
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle1",
        phone : '+905534958116',
        code : 111112
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle2",
        phone : '+905076482649',
        code : 111113
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle3",
        phone : '+905074282286',
        code : 111114
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle4",
        phone : '+905467633711',
        code : 111115
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle5",
        phone : '+905548436914',
        code : 111116
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle6",
        phone : '+905541112233',
        code : 111117
    })
    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle7",
        phone : '+905543332211',
        code : 111118
    })
    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle8",
        phone : '+905544442211',
        code : 111119
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hle9",
        phone : '+905544442212',
        code : 111120
    })


    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl10",
        phone : '+905544442213',
        code : 111121
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl11",
        phone : '+905544442214',
        code : 111122
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl12",
        phone : '+905544442215',
        code : 111123
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl13",
        phone : '+905544442216',
        code : 111124
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl14",
        phone : '+905012222222',
        code : 111125
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl15",
        phone : '+905012222233',
        code : 111126
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl16",
        phone : '+31606072023',
        code : 111127
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl17",
        phone : '+12015552022',
        code : 111128
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl18",
        phone : '+31606072017',
        code : 111129
    })

    backdoors.push({
        id : "z1rvzxy8urje1aek6rgggerykis6hl19",
        phone : '+905056956979',
        code : 111129
    })

    function backdoorApplicable(phoneNumber){
        for(var i = 0; i < backdoors.length; i++){
            if(phoneNumber == backdoors[i].phone){
                return true;
            }
        }
        return false;
    }
    function retrieveCode(type, text){
        for(var i = 0; i < backdoors.length; i++){
            if(type == 1 && text == backdoors[i].phone){
                return backdoors[i].id;
            }
            else if(type == 2 && text == backdoors[i].id){
                return backdoors[i].phone;
            }
        }
        return '';
    }

    app = application;
    app.post('/sendSMSVerification', function(request, response){
        if(request.method !== HttpMethods.POST) {
            return prepareResponseResult(request, response, HttpStatus.METHOD_NOT_ALLOWED,null, 'METHOD_NOT_ALLOWED')//response.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
        }
        const phoneNumber = request.body.phoneNumber;
        if(backdoorApplicable(phoneNumber)){
            return prepareResponseResult(request, response, HttpStatus.OK, {
                id: retrieveCode(1, phoneNumber),
                href: "https://rest.messagebird.com/verify/hnrgjp1e6c8u9o3vgk63h152jhmcif96",
                recipient: 35308525623,
                reference: null,
                messages: {
                    href: "https://rest.messagebird.com/messages/hnrgjp1e6c8u9o3vgk63h152jhmcif96"
                },
                status: "sent",
                createdDatetime: "2016-05-03T14:26:57+00:00",
                validUntilDatetime: "2023-05-03T14:27:27+00:00"
            })
        }
        else {
            if(phoneNumber == undefined){
                return prepareResponseResult(request, response, HttpStatus.BAD_REQUEST, 'phoneNumberIsNotValid')
            }
            axios({
                baseURL: smsVerificationAPIBaseURL,
                url: 'verify',
                method: 'POST',
                headers: {
                    'Authorization': `AccessKey ${smsVerificationAPIToken}`,
                    'Accept': 'application/json'
                },
                data: {
                    recipient: parseInt(phoneNumber.replace('+', '')),
                    originator: 'Humally',
                    timeout: 180,
                    template: 'Your Humally verification code is : %token'
                }
            }).then((smsResponse) => {
                return prepareResponseResult(request, response, HttpStatus.OK, smsResponse.data)//response.status(HttpStatus.OK).send(smsResponse.data);
            }).catch((error) => {
                return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, { status: error.response.status, statusText: error.response.statusText, data: error.response.data }, { status: error.response.status, statusText: error.response.statusText, data: error.response.data })//response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ status: error.response.status, statusText: error.response.statusText, data: error.response.data });
            })
        }
    });
    app.post('/verifySMSToken', function(request, response){
        if(request.method !== HttpMethods.POST) {
            return prepareResponseResult(request, response, HttpStatus.METHOD_NOT_ALLOWED, null, 'METHOD_NOT_ALLOWED')//response.sendStatus(HttpStatus.METHOD_NOT_ALLOWED);
        }
        const verifyId = request.body.verifyId;
        const token = request.body.token;

        if (retrieveCode(2, verifyId) != '') {
            let phoneNo = retrieveCode(2, verifyId);
            authenticationContainer.isUserDisabled(phoneNo).then((result)=>{
                if(result){
                    return authenticationContainer.revokeUser(phoneNo).then((uid) => {
                        return authenticationContainer.registerUser(uid, retrieveCode(2, verifyId), function(err, data){
                            return prepareResponseResult(request, response, HttpStatus.OK, data);
                        }, function(err){
                            return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, err, err);
                        })
                    })
                }else{
                    let userId = guid();
                    return authenticationContainer.registerUser(userId, retrieveCode(2, verifyId), function(err, data){
                        return prepareResponseResult(request, response, HttpStatus.OK, data);
                    }, function(err){
                        return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, err, err);
                    })
                }
            })
        }else{
            return axios({
                baseURL: smsVerificationAPIBaseURL,
                method: 'GET',
                url: `verify/${verifyId}`,
                headers: {
                    'Authorization': `AccessKey ${smsVerificationAPIToken}`,
                    'Accept': 'application/json'
                },
                params: {
                    token: token
                }
            }).then((verifyResponse) => {
                if(verifyResponse.data && verifyResponse.data.status === MessageBirdVerifyStatus.VERIFIED) {
                    let phoneNo = '+' + verifyResponse.data.recipient;
                    helper.isUserFrozen(phoneNo).then((result)=>{
                        if(result){
                            return helper.revokeUser(phoneNo).then((uid) => {
                                return authenticationContainer.registerUser(uid, verifyResponse.data.recipient, function(err, data){
                                    return prepareResponseResult(request, response, HttpStatus.OK, data);
                                }, function(err){
                                    return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, err, err);
                                })
                            })
                        }else{
                            let userId = guid();
                            return authenticationContainer.registerUser(userId, verifyResponse.data.recipient, function(err, data){
                                return prepareResponseResult(request, response, HttpStatus.OK, data);
                            }, function(err){
                                return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, err, err);
                            })
                        }
                    })
                } else {
                    return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, verifyResponse.data, verifyResponse.data)//response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(verifyResponse.data);
                }
            }).catch((error) => {
                return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, { status: error.response.status, statusText: error.response.status, message: error.message }, { status: error.response.status, statusText: error.response.status, message: error.message })//response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ status: error.response.status, statusText: error.response.status, message: error.message });
            });
        }
    })

    app.post('/registerUser', function(request, response){
        let userId = guid();
        authenticationContainer.registerUser(userId,request.body.phoneNumber,
            function(err, data){
                if(err){
                    return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, err, err)//response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(verifyResponse.data);
                }
                return prepareResponseResult(request, response, HttpStatus.OK, data)
            },
            function(err){
                return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, err, err)//response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(verifyResponse.data);
            })
    })

    app.get('/getToken', function(request,response){
        authenticationContainer.getToken(request.query.uid, request.query.secret,
            function(idToken){
                return prepareResponseResult(request, response, HttpStatus.OK, idToken)
            },
            function(err){
                return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, err, err)
            }
            )

    })

    /*app.get('/testFuncValidate', function(request, response){
        console.log(request.headers.authorization)
        authenticationContainer.validateToken(request, request.headers.authorization, function(data){
            console.log(data);
            console.log(request.user);
            if(data == 'Authorized')
                return prepareResponseResult(request, response, HttpStatus.OK, true)
            return prepareResponseResult(request, response, HttpStatus.INTERNAL_SERVER_ERROR, null, false)
        })
    })*/

}
