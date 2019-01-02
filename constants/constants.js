/**
 * Created by
 * Sidika Turkan AKKOYUN CAY
 * Saim CAY
 * on 16.09.2017.
 */

exports.EventSortingType = {
    "DISTANCE": 0,
    "TIME": 1
};

exports.DEFAULT_DATE = "1970/01/01"; //For using sort by time comparator

exports.HttpStatus = {
    "OK": 200,
    "CREATED": 201,
    "NO_CONTENT": 204,
    "NOT_MODIFIED": 304,
    "BAD_REQUEST": 400,
    "NOT_FOUND": 404,
    "METHOD_NOT_ALLOWED": 405,
    "INTERNAL_SERVER_ERROR": 500
};

exports.HttpMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

exports.NOTIFICATIONS = {
    TYPES: {
        MATCH_REQUEST: 0,
        MATCH_REQUEST_ACCEPTED: 1,
        FRIEND_REQUEST: 2,
        FRIEND_REQUEST_ACCEPTED: 3,
        INVITE_PLAN: 4,
        INVITE_PLAN_ACCEPTED: 5,
        INVITE_PLAN_NEXT_TIME: 6,
        JOIN_PLAN: 7,
        JOIN_PLAN_ACCEPT: 8,
        JOIN_MEET: 9,
        JOIN_MEET_ACCEPT: 10,
        JOIN_MEET_AND_FRIEND: 11,
        JOIN_MEET_AND_FRIEND_ACCEPT: 12,
        CANCEL_EVENT: 13,
        PHONE_REQUEST: 14,
        PHONE_REQUEST_ACCEPT: 15,
        MAIL_REQUEST: 16,
        MAIL_REQUEST_ACCEPT: 17,
        MISSED_THE_EVENT: 18,
        MISSED_TO_JOIN: 19,
        NEW_COMMENT: 20,
        COMMENTED_YOUR_POST: 21,
        CONTACT_REQUEST: 22,
        CONTACT_REQUEST_ACCEPTED: 23,
        PARTICIPATED_TO_EVENT: 24
    },
    STATES: {
        NEW_UNREAD: 0,
        READ: 1,
        READ_AND_REPLY: 2
    },
    ACTIONS: {
        JOIN_MEET: 1,
        JOIN_MEET_ACCEPT: 2,
        JOIN_MEET_AND_FRIEND: 3,
        JOIN_MEET_AND_FRIEND_ACCEPT: 4,
    }
};

exports.TIMELINE_PLAN = {
    TYPES: {
        INVITATION: 0,
        WANT_TO_JOIN: 1,
        ACCEPT_REQUEST: 2
    }
};

exports.GOES_WITH = {
    FRIENDS_COUNT: 5
};

exports.HUMALLY_USER = {
    UID: '0001'
};

