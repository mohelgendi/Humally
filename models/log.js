/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('log', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'type'
		},
		method: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'method'
		},
		detail: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'detail'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now'),
			field: 'created_at'
		}
	}, {
		tableName: 'log'
	});
};
