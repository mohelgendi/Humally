/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('notificationKey', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			field: 'id'
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'name'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now'),
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'updated_at'
		}
	}, {
		tableName: 'notification_key'
	});
};
