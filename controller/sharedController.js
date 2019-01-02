let PlanModel = require('../logicModels/PlanModel.js');
let planLogic = require('../logic/planLogic.js');
let sharedLogic = require('../logic/sharedLogic.js');
let Enums = require('../logicModels/Enum.js');

var app;
const constants = require('../constants/constants');
let HttpStatus = constants.HttpStatus;
module.exports = function(application){
    app = application;

    app.get('/getTableMeta', function(request, response){
        validateToken(request, response, () => {
            let dbObjectName = request.query.dbObjectName;
            return sharedLogic.getTableMeta(dbObjectName, function(data){
                return prepareResponseResult(request, response, constants.HttpStatus.OK, data)
            })
        })
    })
    app.post('/getTableContent', function(request, response){
        validateToken(request, response, () => {
            let filter = request.body.filter;
            let dbObjectName = request.body.dbObjectName;
            return sharedLogic.getTableContent(dbObjectName, filter, function(data){
                return prepareResponseResult(request, response, constants.HttpStatus.OK, data)
            })
        })
    })

    app.post('/updateNotification', function(request, response){
        validateToken(request, response, () => {
            return sharedLogic.setNotification(request.body, request.user.language, function(data){
                return prepareResponseResult(request, response, constants.HttpStatus.OK, data)
            })
        })
    })

    app.get('/getNotifications', function(request, response){
        validateToken(request, response, () => {
            sharedLogic.getNotifications(request.user.uid, request.query.page, request.query.pageSize, request.user.language, function(result){
                return prepareResponseResult(request, response, HttpStatus.OK, result)
            }, function(message, code){
                return prepareResponseResult(request, response, code, message, message);
            })
        })
    })
    app.post('/photoUpload', function(request, response){
        validateToken(request, response, () => {
            cors(request, response, (error) => {
                if (error)
                    return prepareResponseResult(request, response, constants.HttpStatus.BAD_REQUEST, null, error.message)
                mdparse(request, response, () => {
                    let metadata;
                    try {
                        metadata = JSON.parse(request.body.metadata);
                    } catch (error) {
                        metadata = request.body;
                        if(metadata == undefined || metadata.photoType == undefined)
                            return prepareResponseResult(request, response, constants.HttpStatus.BAD_REQUEST, null, 'Metadata is not valid.')
                    }
                    const eventKey = metadata.eventKey;
                    const photoType = metadata.photoType;
                    const userUid = metadata.userUid;
                    const photo = request.files.photo;
                    if (!photo) {
                        return prepareResponseResult(request, response, constants.HttpStatus.BAD_REQUEST, null, 'The request does not carry any file with "photo" fieldname')
                    }
                    if (!photo.contentType.startsWith('image/')) {
                        return prepareResponseResult(request, response, constants.HttpStatus.BAD_REQUEST, null, 'The file is not an image.')
                    }
                    const thumbSizes = (photoType === Enums.PhotoTypes.POST || photoType === Enums.PhotoTypes.COVER ? [420] : [48, 80, 160, 210, 420]);
                    const PHOTO_HEIGHT = photoType === Enums.PhotoTypes.COVER ? 206 : 280;
                    const fileURLs = {};
                    let photosDir = sharedLogic.getPhotoDirection(photoType, userUid, eventKey);
                    let tmpdir = os.tmpdir();
                    let originalPhoto = path.join(tmpdir, photo.filename);
                    let fileExtension = photo.filename.split('.')[photo.filename.split('.').length-1]
                    let rawPhotoName = guid() + '_raw.' + fileExtension;
                    console.log(originalPhoto)
                    return fs.writeFile(originalPhoto, photo.buffer, function(){
                        let errFunc = function(error) {
                            return prepareResponseResult(request, response, constants.HttpStatus.BAD_REQUEST, error, error)
                        };
                        let thenFunc = function(err, data) {
                            fileURLs.raw = data.Location;
                            if (metadata.thumbnail) {
                                fs.unlinkSync(originalPhoto);
                                return prepareResponseResult(request, response, constants.HttpStatus.OK, fileURLs)
                            }
                            return Promise.all(thumbSizes.map((size) => {
                                const THUMB_PREFIX = `thumb_${size}_`;
                                const thumbPhotoName = `${THUMB_PREFIX}${photo.filename}`;
                                const extensionThumb = thumbPhotoName.split('.')[thumbPhotoName.split('.').length - 1]
                                const originalThumbPhotoName = `${THUMB_PREFIX}${(guid()+'.'+extensionThumb)}`;
                                const localeThumbPhoto = path.normalize(path.join(tmpdir, thumbPhotoName));
                                const photoHeight = photoType === Enums.PhotoTypes.POST || photoType === Enums.PhotoTypes.COVER ? PHOTO_HEIGHT : size;
                                var Jimp = require("jimp");
                                return new Promise(function (resolve, reject) {
                                    Jimp.read(originalPhoto, function (err, lenna) {
                                        if (err) {
                                            console.error(err);
                                            throw err;
                                        }
                                        lenna.resize(Jimp.AUTO, photoHeight)
                                            .quality(100)
                                            .write(localeThumbPhoto, function () {
                                                let fileBuffer = fs.readFileSync(localeThumbPhoto);
                                                let thenFunc2 = function(err, data) {
                                                    let thumbDownloadURL = data.Location;
                                                    fs.unlinkSync(localeThumbPhoto);
                                                    fileURLs['t_' + size] = thumbDownloadURL;
                                                    resolve(true);
                                                }
                                                let errFunc2 = function(err, data){
                                                    console.error(err)
                                                    console.log(data);
                                                    fs.unlinkSync(localeThumbPhoto);
                                                    reject(err)
                                                };
                                                return cloudContainer.uploadToS3FromBuffer(fileBuffer, photosDir.replaceAll('\\','/'), originalThumbPhotoName, true, thenFunc2, errFunc2)
                                            });
                                    });
                                });
                            })).then((success) => {
                                console.log(success)
                                fs.unlinkSync(originalPhoto);
                                return prepareResponseResult(request, response, constants.HttpStatus.OK, fileURLs)
                            }).catch(error => {
                                fs.unlinkSync(originalPhoto);
                                console.error('Error in upload file:', error);
                                return prepareResponseResult(request, response, constants.HttpStatus.BAD_REQUEST)
                            });
                        }
                        return cloudContainer.uploadToS3FromBuffer(photo.buffer, photosDir.replaceAll('\\','/'), rawPhotoName, true, thenFunc, errFunc)
                    });
                });
            });
        });
    });

}

