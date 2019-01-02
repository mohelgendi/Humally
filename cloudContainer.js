module.exports = function(appVersion) {
    let resultObject = {};
    const AWS = require('aws-sdk');
    const BUCKET_NAME = appVersion == 1 ? 'humallyfilesdev' : 'humallyfiles';
    const IAM_USER_KEY = 'AKIATROT52QSSJSKR5FT';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME,
        region: 'eu-central-1',
    });


    function retrieveUrl(folderName, fileName){
        const s3 = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
            signatureVersion: 'v4',
            region: 'eu-central-1',
            Bucket: BUCKET_NAME,
        });
        AWS.config.update({accessKeyId: 'id-omitted', secretAccessKey: 'key-omitted'})
        const myBucket = BUCKET_NAME
        const myKey = folderName + '/' + fileName
        const signedUrlExpireSeconds = 60 * 50
        const url = s3.getSignedUrl('getObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
        })
        return url;
    }

    function deleteFromS3(urls, thenFunc, errFunc){


        let objects = [];
        for(let i = 0; i < urls.length; i++){
            let url = urls[i];
            let urlParts = url.split('/');
            let keyName = '';
            console.log(urlParts)

            for(let q = urlParts.length-1; q >=0; q--) {
                if(urlParts[q].indexOf(BUCKET_NAME) >= 0)
                    break;

                if(keyName == '')
                    keyName = urlParts[q] + keyName;
                else
                    keyName = urlParts[q] + '/' + keyName;
            }
            objects.push({
                Key : keyName
            });
        }
        console.log(objects)
        if(objects.length>0){
            var params = {
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: objects,
                },
            };

            return s3bucket.deleteObjects(params, function(err, data) {
                if(err){
                    if(errFunc != undefined) return errFunc(err, data)
                }
                if(thenFunc != undefined) return thenFunc(err, data);e
            });
        }
        }

    function uploadToS3FromBuffer(buf, folderName, fileName, isPublic, thenFunc, errFunc) {

        return s3bucket.createBucket(function () {
            var params = {
                Bucket: BUCKET_NAME,
                Key: folderName + '/' + fileName,
                Body: buf,
                ContentEncoding: 'base64',
            };
            if(isPublic) params.ACL= 'public-read';
            return s3bucket.upload(params, function (err, data) {
                if(err){
                    if(errFunc != undefined) return errFunc(err, data)
                }
                if(thenFunc != undefined) return thenFunc(err, data);
            });
        });
    }

    function uploadToS3FromUrl(url, folderName, fileName, isPublic, thenFunc, errFunc) {
        var request = require('request').defaults({ encoding: null });
        return request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                let buf = new Buffer(body);//new Buffer(data.replace(/^data:image\/\w+;base64,/, ""),'base64')
                return s3bucket.createBucket(function () {
                    var params = {
                        Bucket: BUCKET_NAME,
                        Key: folderName + '/' + fileName,
                        Body: buf,
                        ContentEncoding: 'base64',
                    };
                    if(isPublic) params.ACL= 'public-read';
                    return s3bucket.upload(params, function (err, data) {
                        if(err){
                            console.log('error!!!!')
                            console.log(err)
                            return errFunc(err, data);
                        }
                        if(thenFunc != undefined) return thenFunc(err, data);
                    });
                });
            }
        });
    }
    resultObject.uploadToS3FromUrl = uploadToS3FromUrl;
    resultObject.retrieveUrl = retrieveUrl;
    resultObject.uploadToS3FromBuffer = uploadToS3FromBuffer;
    resultObject.deleteFromS3 = deleteFromS3;
    return resultObject;
}