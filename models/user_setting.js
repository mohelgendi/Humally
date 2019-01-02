/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userSetting', {
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
		whoCanContactMe: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'who_can_contact_me'
		},
		language: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'language'
		},
		messagesNotif: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'messages_notif'
		},
		friendrequestsNotif: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'friendrequests_notif'
		},
		invitesNotif: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'invites_notif'
		},
		joinedNotif: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'joined_notif'
		},
		commentNotif: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'comment_notif'
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
		tableName: 'user_setting'
	});
};
