/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('group', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'name'
		},
		photoUrl: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'photo_url'
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
		tableName: 'group'
	});
};
