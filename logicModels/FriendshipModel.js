
class FriendshipModel {
    constructor(
        id = 0,
        userId,
        friendUserId,
        friendshipTime,
        status,
        updatedAt
    ) {
        this.id = id;
        this.userId = userId;
        this.friendUserId = friendUserId;
        this.updatedAt = updatedAt;
        this.status = status;
    }
}

module.exports = FriendshipModel;