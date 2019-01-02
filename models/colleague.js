/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('colleague', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		companyId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'company',
				key: 'id'
			},
			field: 'company_id'
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
		role: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'role'
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
		tableName: 'colleague'
	});
};
