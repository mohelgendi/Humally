
class EventParticipantModel {
    constructor(
        id = 0,
        planKey,
        eventKey,
        interactionType,
        uid
    ) {
        this.id = id;
        this.planKey = planKey;
        this.eventKey = eventKey;
        this.interactionType = interactionType;
        this.uid = uid;
    }
}

module.exports = EventParticipantModel;