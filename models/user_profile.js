/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userProfile', {
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
		coverPhoto: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'cover_photo'
		},
		educations: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'educations'
		},
		interests: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'interests'
		},
		jobs: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'jobs'
		},
		photo: {
			type: DataTypes.JSON,
			allowNull: false,
			field: 'photo'
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
		tableName: 'user_profile'
	});
};
