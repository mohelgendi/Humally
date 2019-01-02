let Enums = {
    LogType : {
        Error : 0,
        Warning : 1,
        Info : 2
    },
    LogType : {
        Info: 0,
        Warning: 1,
        Error: 2
    }
    ,
    Action : {
        Create : 0,
        Update : 1,
        Delete : 2
    },
    InvitationStatus : {
        Invited : 0,
        Accepted : 1,
        Rejected : 2,
        Requested : 3
    },
    FriendshipStatus:{
        Requested: 0,
        BeFriend: 1,
        Rejected: 2
    },
    DeviceType : {
        ios : 'ios',
        android : 'android'
    },
    ProfileType : {
        Private : 0,
        Business : 1
    },
    PermissionType : {
        Phone : 0
    },
    PermissionStatus : {
        Requested : 0,
        Accepted : 1,
        Rejected : 2
    },
    PhotoTypes : {
        POST: "POST",
        PROFILE: "PROFILE",
        OTHERS: "UPLOAD",
        PHOTOS: "PHOTOS",
        COVER: "COVER",
    },
    PhotoLocations : {
        POST: "posts/",
        PROFILE: "profilePictures/",
        UPLOAD: "uploads/",
        PHOTOS: "profilePictures/",
        COVER: "profilePictures/"
    }
};
Object.freeze(Enums.Action);
module.exports = Enums;


