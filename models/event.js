/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('event', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		content: {
			type: DataTypes.JSON,
			allowNull: true,
			field: 'content'
		},
		filterable: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false,
			field: 'filterable'
		},
		startDate: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'start_date'
		},
		segment: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'segment'
		},
		genre: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'genre'
		},
		subGenre: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'sub_genre'
		},
		type: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'type'
		},
		subType: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'sub_type'
		},
		promoter: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'promoter'
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'name'
		},
		location: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '',
			field: 'location'
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
		locationId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'location',
				key: 'id'
			},
			field: 'location_id'
		},
		authenticationId: {
			type: DataTypes.BIGINT,
			allowNull: true,
			references: {
				model: 'user_authentication',
				key: 'id'
			},
			field: 'authentication_id'
		}
	}, {
		tableName: 'event'
	});
};
