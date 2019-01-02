/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('payment', {
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
		currency: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'currency'
		},
		paymentamount: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			field: 'paymentamount'
		},
		paymentTime: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'payment_time'
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
		tableName: 'payment'
	});
};
