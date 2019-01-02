/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('company', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		emailDomain: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'email_domain'
		},
		subscriptionCount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'subscription_count'
		},
		subscriptionStartDate: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'subscription_start_date'
		},
		endDate: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'end_date'
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'name'
		},
		logoUrl: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'logo_url'
		},
		kvk: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'kvk'
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'address'
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'email'
		},
		website: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'website'
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'phone'
		},
		fax: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'fax'
		},
		administratorEmail: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'administrator_email'
		},
		kvkJson: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'kvk_json'
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
		authenticationId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'user_authentication',
				key: 'id'
			},
			field: 'authentication_id'
		}
	}, {
		tableName: 'company'
	});
};
