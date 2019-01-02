/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('fcmDevice', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id'
			},
			field: 'user_id'
		},
		deviceType: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'device_type'
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'token'
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
		tableName: 'fcm_device'
	});
};
