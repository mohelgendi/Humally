class LocationModel {
    constructor(
        id = 0,
        userId,
        latitude,
        longitude
    ) {
        this.id = id;
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

module.exports = LocationModel;