class ViewQueryModel{
    constructor(view, then, JSONFilter, page, pageSize, orderBy) {
        this.view = view;
        this.then = then;
        this.JSONFilter = JSONFilter;
        this.page = page;
        this.pageSize = pageSize;
        this.orderBy = orderBy;
    }
}
module.exports = ViewQueryModel;