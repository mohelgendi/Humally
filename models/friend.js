/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('friend', {
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
		friendUserId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id'
			},
			field: 'friend_user_id'
		},
		friendshipTime: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'friendship_time'
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
		status: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '0',
			field: 'status'
		}
	}, {
		tableName: 'friend'
	});
};
