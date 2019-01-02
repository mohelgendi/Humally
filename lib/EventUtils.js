/**
 * Created by
 * Sidika Turkan AKKOYUN CAY
 * Saim CAY
 * on 16.09.2017.
 */

const DummyData = require('../resource/meetPeople-export.json');
const MapUtils = require('./MapUtils');
const Comparators = require('./Comparators');
const {EventSortingType} = require('../constants/constants');

/**
 * Gets events in the specific range to user location
 * @param {Object} userLocation
 * @param {number} eventRange
 * @param {number} sortType
 * @returns {Array}
 */
exports.getEventsInRange = function (userLocation, eventRange, sortType) {
    let dataKeys = Object.keys(DummyData);
    let socialEvents = [{key:"map"}];//For rendering map cell on the front end


    dataKeys.map(function (key) {
        let socialEvent = DummyData[key];
        let socialEventDistance = MapUtils.getDistance(userLocation, socialEvent.location);
        if (socialEventDistance <= eventRange) {
            socialEvent.key = key;
            socialEvent.distance = socialEventDistance;
            socialEvents.push(socialEvent);
        }

        return true;
    });

    eventSort(socialEvents, sortType);

    return socialEvents;
};

/**
 * Sorting events according to given sorting type
 * @param {Object} events
 * @param {number} sortType
 */
function eventSort(events, sortType) {
    switch (sortType) {
        case EventSortingType.DISTANCE:
            events.sort(Comparators.sortByDistance);
            break;
        case EventSortingType.TIME:
            events.sort(Comparators.sortByTime);
            break;
        default:
            events.sort(Comparators.sortByDistance);
            break;
    }
}