/**
 * decoding url to firebase storage path
 * @param {} bucketName
 * @param {String} url
 */
function getPathFromURL(bucketName, url) {
    console.log(url)
    console.log(bucketName)
    if(url.indexOf('firebase') < 0) return '-11111111';
    return decodeURIComponent(url.split('?')[0].split(bucketName)[1].split('/')[2]);
}

module.exports = getPathFromURL;