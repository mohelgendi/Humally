/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('detailed_plan', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'plan_id'
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: true,
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
        checkInPlace: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'check_in_place'
        },
        media: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'media'
        }

    }, {
        tableName: 'plan'
    });
};
