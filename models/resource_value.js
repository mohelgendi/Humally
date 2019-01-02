/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('resourceValue', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		keyId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			references: {
				model: 'resource_key',
				key: 'id'
			},
			field: 'key_id'
		},
		languageCode: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'language_code'
		},
		resourceValue: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'resource_value'
		}
	}, {
		tableName: 'resource_value'
	});
};
