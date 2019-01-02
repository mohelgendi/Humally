/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('plan', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		userId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: 'user',
				key: 'id'
			},
			field: 'user_id'
		},
		category: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'category'
		},
		subCategory: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'sub_category'
		},
		isPublic: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			field: 'is_public'
		},
		location: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'location'
		},
		note: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'note'
		},
		startTime: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'start_time'
		},
		endTime: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'end_time'
		},
		profileType: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'profile_type'
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
		checkInPlace: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'check_in_place'
		},
		media: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'media'
		},
		cancelled: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
			field: 'cancelled'
		},
		eventId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: 'event',
				key: 'id'
			},
			field: 'event_id'
		}
	}, {
		tableName: 'plan'
	});
};
