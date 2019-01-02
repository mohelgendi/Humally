

class DeleteModel {
    constructor(table, where, then, err) {
        this.table = table;
        this.where = where;
        this.then = then;
        this.err = err;
    }
}

module.exports = DeleteModel;