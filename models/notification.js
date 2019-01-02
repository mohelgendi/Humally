/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('notification', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		keyId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'notification_key',
				key: 'id'
			},
			field: 'key_id'
		},
		content: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'content'
		},
		notificationDate: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'notification_date'
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
		read: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			field: 'read'
		}
	}, {
		tableName: 'notification'
	});
};
