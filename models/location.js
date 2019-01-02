/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('location', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		placeId: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'place_id'
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'country'
		},
		district: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'district'
		},
		street: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'street'
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
		}
	}, {
		tableName: 'location'
	});
};
