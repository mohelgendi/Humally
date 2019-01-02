/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userLocation', {
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
		latitude: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			field: 'latitude'
		},
		longitude: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			field: 'longitude'
		},
		phoneNumber: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'phone_number'
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
		tableName: 'user_location'
	});
};
