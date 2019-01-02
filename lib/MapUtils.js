/**
 * Created by
 * Sidika Turkan AKKOYUN CAY
 * Saim CAY
 * on 16.09.2017.
 */

/**
 * Degree to radian converter
 * @param {number} degree
 * @returns {number}
 */
function degree2Radian(degree) {
    let radian = degree * Math.PI / 180;
    return radian;
}

/**
 * Haversine formula for calculating distance between two point on the map
 * @param {Object} point1
 * @param {Object} point2
 * @return {number} distance
 */
exports.getDistance = function (point1, point2) {
    if (point1.longitude === undefined || point1.latitude === undefined) {
        throw new Exception("First coordinate is not valid");
    }

    if (point2.longitude === undefined || point2.latitude === undefined) {
        throw new Exception("Second coordinate is not valid");
    }

    const EARTH_RADIUS = 6378137;

    let deltaLatitude = degree2Radian(point2.latitude - point1.latitude);
    let deltaLongitude = degree2Radian(point2.longitude - point1.longitude);

    let a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
        Math.cos(degree2Radian(point1.latitude)) * Math.cos(degree2Radian(point2.latitude)) *
        Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = EARTH_RADIUS * c;

    return distance;
};

exports.getDelta = function (location, radius) {
    if (location.longitude === undefined || location.latitude === undefined){
        throw "Location coordinate is not valid";
    }

    let deltaLongitude = Math.abs(radius / (111320 * Math.cos(location.latitude)));
    let deltaLatitude = radius / 110574;
    let deltaInRadius = {
        latitude: 2 * deltaLatitude,
        longitude: 2 * deltaLongitude
    };

    return deltaInRadius;
};