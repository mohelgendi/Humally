/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userTimeline', {
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
		planId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'plan',
				key: 'id'
			},
			field: 'plan_id'
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'type'
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
		tableName: 'user_timeline'
	});
};
