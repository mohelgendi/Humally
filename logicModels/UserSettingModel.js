
class UserSettingModel {
    constructor(
        id = 0,
        userId,
        whoCanContactMe = 'everybody',
        language,
        messagesNotif = true,
        friendrequestsNotif = true,
        invitesNotif = true,
        joinedNotif = true,
        commentNotif = true
    ) {
        this.id = id;
        this.userId = userId
        this.whoCanContactMe = whoCanContactMe;
        this.language = language;
        this.messagesNotif = messagesNotif;
        this.friendrequestsNotif = friendrequestsNotif;
        this.invitesNotif = invitesNotif;
        this.joinedNotif = joinedNotif;
        this.commentNotif = commentNotif;
    }
}

module.exports = UserSettingModel;