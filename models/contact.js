/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('contact', {
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
		contactUserId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'user',
				key: 'id'
			},
			field: 'contact_user_id'
		},
		contactTime: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'contact_time'
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
			allowNull: false,
			field: 'status'
		}
	}, {
		tableName: 'contact'
	});
};
