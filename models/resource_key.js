/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('resourceKey', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'name'
		}
	}, {
		tableName: 'resource_key'
	});
};
