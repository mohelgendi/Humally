
class UpdateModel {
    constructor(table, object, where, then, err) {
        this.table = table;
        this.object = object;
        this.where = where;
        this.then = then;
        this.err = err;
    }
}
module.exports = UpdateModel;