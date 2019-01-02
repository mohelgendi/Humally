
class DeviceModel {
    constructor(
        id = 0,
        userId,
        deviceType,
        token,
        updatedAt
    ) {
        this.id = id;
        this.userId = userId;
        this.deviceType = deviceType;
        this.token = token;
        this.updatedAt = updatedAt;
    }
}

module.exports = DeviceModel;