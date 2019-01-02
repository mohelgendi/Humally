
class PlanModel {
    constructor(
        planKey = 0,
        id = 0,
        category,
        subCategory,
        checkInPlace,
        location,
        note,
        media,
        start,
        end,
        invitedUsers = [],
        userId,
        profileType,
        eventId
    ) {
        this.planKey = planKey;
        if(this.planKey != 0)this.id = this.planKey;
        this.category = category;
        this.subCategory = subCategory;
        this.checkInPlace = checkInPlace;
        this.location = location;
        this.note = note;
        this.media = media;
        this.startTime = start;
        this.endTime = end;
        this.invitedUsers = invitedUsers;
        this.userId = userId;
        this.profileType = profileType;
        this.eventId = eventId;
    }
}

module.exports = PlanModel;