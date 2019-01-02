/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('frozenUser', {
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
		expirationActions: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'expiration_actions'
		},
		rollbackActions: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'rollback_actions'
		},
		frozenTime: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'frozen_time'
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
		tableName: 'frozen_user'
	});
};
