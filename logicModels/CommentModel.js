
class CommentModel {
    constructor(
        userId = 0,
        planId = 0,
        content
    ) {
        this.userId = userId;
        this.planId = planId;
        this.content = content;
    }
}

module.exports = CommentModel;