/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userAuthentication', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		uid: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'uid'
		},
		secret: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'secret'
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'token'
		},
		phoneNumber: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'phone_number'
		},
		extraContent: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'extra_content'
		},
		tokenTime: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'token_time'
		},
		registryTime: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'registry_time'
		},
		disabled: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
			field: 'disabled'
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
		tableName: 'user_authentication'
	});
};
