/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('userPhoto', {
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
		photo: {
			type: DataTypes.TEXT,
			allowNull: false,
			field: 'photo'
		},
		uploadTime: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'upload_time'
		},
		note: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'note'
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
		tableName: 'user_photo'
	});
};
