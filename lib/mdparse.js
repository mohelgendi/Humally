const Busboy = require('busboy');

/**
 * form-data parser middleware for multipart/form-data rawbody parsing.
 * @author Saim CAY <saimcay@gmail.com>
 * @callback nextFunc
 * @param {Object} request
 * @param {Object} response
 * @param {nextFunc} callback
 */
function mdparse(request, response, callback) {
    let files = {}, body = {}, error = undefined;
    let busboy = new Busboy({headers: request.headers});

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        let buffer = new Buffer([]);
        file.on('end', (err) => {
            files[fieldname] = {
                filename,
                buffer,
                contentType: mimetype,
                size: buffer.length
            };
            error = err;
            file.unpipe();
        }).on('data', (data) => {
            buffer = Buffer.concat([buffer, data]);
        }).on('error', (err) => {
            console.error('Error on file write');
            error = err;
            file.unpipe();
        });
    })
    busboy.on('field', function (fieldname, val) {// extra fieldnameTruncated, valTruncated, encoding, mimetype
        body[fieldname] = val;
    })
    busboy.on('finish', () => {
        request.files = files;
        request.body = body;
        if (error) {
            console.error('finish : ' + error.toString());
            response.status(400).send(error.toString());
        }
        return callback();
    });

    request.pipe(busboy);
}

module.exports = mdparse;