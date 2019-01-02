/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('usertbl', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'firstname'
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'lastname'
		}
	}, {
		tableName: 'usertbl'
	});
};
