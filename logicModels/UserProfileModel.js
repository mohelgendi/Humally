
class UserProfileModel {
    constructor(
        id = 0,
        userId,
        coverPhoto,
        educations = null,
        interests = null,
        jobs = null,
        photo
    ) {
        this.id = id;
        this.userId = userId;
        this.coverPhoto = coverPhoto;
        this.educations = educations;
        this.interests = interests;
        this.jobs = jobs;
        this.photo = photo;
    }
}

module.exports = UserProfileModel;