/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('interested', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		eventId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'event',
				key: 'id'
			},
			field: 'event_id'
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
		tableName: 'interested'
	});
};
