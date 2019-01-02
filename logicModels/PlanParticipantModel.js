
class PlanParticipantModel {
    constructor(
        planId = 0,
        userId = 0,
        status = null
    ) {
        this.planId = planId;
        this.userId = userId;
        this.status = status;
    }
}

module.exports = PlanParticipantModel;