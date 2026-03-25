module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define(
    "students",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
      },
      current_grade: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "parents",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
    },
    {
      tableName: "students",
      timestamps: false,
    },
  );

  Students.associate = function (models) {
    Students.belongsTo(models.parents, {
      foreignKey: "parent_id",
      as: "parent",
    });
    Students.hasMany(models.class_registrations, {
      foreignKey: "student_id",
      as: "registrations",
    });
    Students.hasMany(models.subscriptions, {
      foreignKey: "student_id",
      as: "subscriptions",
    });
  };

  return Students;
};
