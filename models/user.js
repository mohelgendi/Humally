/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		bio: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'bio'
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'country'
		},
		dateOfBirth: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			field: 'date_of_birth'
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'description'
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'email'
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'first_name'
		},
		gender: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'gender'
		},
		language: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'language'
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'last_name'
		},
		middleName: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'middle_name'
		},
		livingAddress: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'living_address'
		},
		loggedInBefore: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			field: 'logged_in_before'
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'phone_number'
		},
		relationship: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'relationship'
		},
		sexualOrientation: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'sexual_orientation'
		},
		profileVersion: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: '0',
			field: 'profile_version'
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
		userAuthenticationId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: 'user_authentication',
				key: 'id'
			},
			field: 'user_authentication_id'
		}
	}, {
		tableName: 'user'
	});
};
