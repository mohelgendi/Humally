/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chat', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		receiverId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'receiver_id'
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'type'
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'message'
		},
		sentDate: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'sent_date'
		},
		groupId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: 'group',
				key: 'id'
			},
			field: 'group_id'
		},
		contentType: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'content_type'
		},
		localTime: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'local_time'
		},
		userPictureUrl: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'user_picture_url'
		},
		userName: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'user_name'
		},
		messageId: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'message_id'
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
		tableName: 'chat'
	});
};
