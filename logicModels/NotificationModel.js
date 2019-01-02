
class NotificationModel {
    constructor(
        id = 0,
        keyId,
        content,
        notificationDate,
        userId
    ) {
        this.id = id;
        this.keyId = keyId;
        this.content = content;
        this.notificationDate = notificationDate;
        this.userId = userId;
    }
}

module.exports = NotificationModel;