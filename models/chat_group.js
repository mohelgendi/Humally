/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chatGroup', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		groupId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'group',
				key: 'id'
			},
			field: 'group_id'
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
		tableName: 'chat_group'
	});
};
