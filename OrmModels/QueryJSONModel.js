class QueryJSONModel{
    constructor(table, then, JSONFilter, page, pageSize, orderBy) {
        this.table = table;
        this.then = then;
        this.JSONFilter = JSONFilter;
        this.page = page;
        this.pageSize = pageSize;
        this.orderBy = orderBy;
    }
}
module.exports = QueryJSONModel;