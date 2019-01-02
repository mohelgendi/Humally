var DEV = 1;
var DIST = 2;
var currentStateOfVersion = DEV;
const constants = require('./constants/constants');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./HumallyServiceDocumentation.json');

let initialized = false;
global.authenticationContainer = require('./Authentication/authenticationContainer')();
global.schedule = require('node-schedule');
global.HttpStatus = constants.HttpStatus;
global.cloudContainer = require('./cloudContainer')(currentStateOfVersion);
global.socketLogic = null ;
global.InsertModel = require('./OrmModels/InsertModel.js');
global.DeleteModel = require('./OrmModels/DeleteModel.js');
global.UpdateModel = require('./OrmModels/UpdateModel.js');
global.ViewQueryModel = require('./OrmModels/ViewQueryModel.js');
global.InsertOrUpdateModel = require('./OrmModels/InsertOrUpdateModel.js');
global.QueryJSONModel = require('./OrmModels/QueryJSONModel.js');
global.QueryStringModel = require('./OrmModels/QueryStringModel.js');
global.ormContainer = currentStateOfVersion == DIST ? require('./ormContainer')('postgres', 'HumallyDbV2', 'postgresql', 'sapass123', 'humallyinstancev2.coggeq1s2gjx.eu-central-1.rds.amazonaws.com', 5432, thenFuncORM) :
    require('./ormContainer')('postgres', 'HumallyDbV2', 'postgresql', 'sapass123', 'humallyinstancev2.coggeq1s2gjx.eu-central-1.rds.amazonaws.com', 5432, thenFuncORM);
global.Op = ormContainer.JSONOperands;
global.clearObject = function(data){
    return JSON.parse(JSON.stringify(data));
}
Date.prototype.addDays = function(days) {
    this.setDate( this.getDate()  + days);
    return this;
};

var normalObjK = Object.keys;
global.Object.keys = function(param){
    if(param == null || param == undefined) return [];
    return normalObjK(param)
}

function init(){
  if (initialized) {
          return;
      }
    global._ = Object.assign({}, {orderBy: require('lodash/orderBy'), rearg : require('lodash/rearg'), mapKeys : require('lodash/mapKeys'), camelCase : require('lodash/camelCase')});
    global.cors = require('cors')({origin: true});
    global.moment = require('moment');
    global.geodist = require('geodist');
    global.mdparse = require('./lib/mdparse');
    global.spawn = require('child-process-promise').spawn;
    global.path = require('path');
    global.os = require('os');
    global.fs = require('fs');
    global.axios = require('axios');
    const constants = require('./constants/constants');
    global.HttpStatus = constants.HttpStatus;
    global.NOTIFICATIONS = constants.NOTIFICATIONS;
    global.TIMELINE_PLAN = constants.TIMELINE_PLAN;
    global.GOES_WITH = constants.GOES_WITH;
    global.HUMALLY_USER = constants.HUMALLY_USER;
    const notificationConstants = require('./constants/notificationConstants');
    global.NOTIFICATIONS_CONSTANTS = notificationConstants.NOTIFICATIONS_CONSTANTS;
    const MapUtils = require('./lib/MapUtils');
    global.getDelta = MapUtils.getDelta;
    const comparators = require('./lib/Comparators');
    global.sortByDate = comparators.sortByDate;
    global.sortByDateTime = comparators.sortByDateTime;
    global.sortByDateForTimeline = comparators.sortByDateForTimeline;
    global.getPathFromURL = require('./lib/Utils');
    initialized = true;
}

var express = require('express');
global.resourceHelper = require('./logicModels/ResourceHelper.js');
var app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:500000}));
init();

global.prepareResponseResult = function(request, response, status, data, err){
    if(data !== undefined) {
        if(typeof data === 'object'){
            if(Array.isArray(data)){
                data = { value : data };
            }
        }
        else
            data = { value : data };
    }

    let errorDetail = !isNaN(parseFloat(err)) && isFinite(err) ?
        {
            message : resourceHelper.translate(err, request.user.language),
            id : err
        }
        :
        {
            message : err ,
            id: -1
        };
    let result = {
        data: data === undefined ? ( err === undefined ? { 'value' : 'true' } : { 'value' : 'false' } ): data,
        success : err === undefined ? true : false,
        error : err === undefined ? [] : [
            {
                code : status,
                detail : errorDetail
            }
        ]
    };
    console.log(result)
    return response.status(status).send(result);
}

global.validateToken = (req, res, next) => {
    console.log('auth', req.headers.authorization)
    if (req.headers.authorization != undefined){
        return authenticationContainer.validateToken(req, req.headers.authorization, function(authData){
            try{
                if(authData == 'Authorized')
                    return next();
                return prepareResponseResult(req, res, 403, 'Unauthorized', 'Unauthorized')
            }
            catch(ex){
                return prepareResponseResult(req, res, 403, null, ex.message)
            }
        })
    }
    return prepareResponseResult(req, res, 403, 'Unauthorized', 'Unauthorized')//res.status(403).send('Unauthorized' + error.message);
};

global.formattedDate = function (date){
    return date != undefined ? moment(date).toISOString() : null;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

global.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

require('./Authentication/authentication')(app);
require('./controller/userController')(app);
require('./controller/planController')(app);
require('./controller/sharedController')(app);
require('./controller/logController')(app);


var server = app.listen((process.env.PORT || 8081), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("app listening at http://%s:%s", host, port);
})

server.setTimeout(500000);
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/htmlPages'));

function thenFuncORM(){
    socketLogic = require('./socket')(server);
    resourceHelper.register();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
}