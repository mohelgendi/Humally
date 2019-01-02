/**
 * Created by
 * Sidika Turkan AKKOYUN CAY
 * Saim CAY
 * on 16.09.2017.
 */

const {DEFAULT_DATE} = require('../constants/constants');

/**
 * Comparator function for sorting events by distance
 * @param {Object} event1
 * @param {Object} event2
 * @returns {number}
 */
exports.sortByDistance = function (event1, event2) {
    if (event1.distance < event2.distance) {
        return -1;
    } else if (event1.distance > event2.distance) {
        return 1;
    } else {
        return 0;
    }
};

/**
 * Comparator function for sorting events by time only
 * @param {Object} event1
 * @param {Object} event2
 * @returns {number}
 */
exports.sortByTime = function (event1, event2) {
    let time1 = new Date(DEFAULT_DATE + " " + event1.plannedTime);
    let time2 = new Date(DEFAULT_DATE + " " + event2.plannedTime);

    return time1 - time2;
};

/**
 * Comparator function for sorting events by date only
 * @param {Object} event1
 * @param {Object} event2
 * @returns {number}
 */
exports.sortByDate = function (event1, event2){
    let event1Key = Object.keys(event1)[0];
    let event2Key = Object.keys(event2)[0];

    return event2[event2Key].createDate - event1[event1Key].createDate;
};

/**
 * Comparator function for sorting events by date and time
 * @param {Object} event1
 * @param {Object} event2
 * @returns {number}
 */
exports.sortByDateTime = function (event1, event2){
    return event1.plannedTime.start - event2.plannedTime.start;
};

exports.sortByDateForTimeline = function (event1, event2){
    let event1Key = Object.keys(event1)[0];
    let event2Key = Object.keys(event2)[0];

    return event1[event1Key].plannedTime - event2[event2Key].plannedTime;
};

