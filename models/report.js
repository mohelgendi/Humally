/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('report', {
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
		reportDetail: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'report_detail'
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
		tableName: 'report'
	});
};
