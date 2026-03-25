module.exports = (sequelize, DataTypes) => {
  const ClassRegistrations = sequelize.define(
    "class_registrations",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "classes",
          key: "id",
        },
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      registered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "class_registrations",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["class_id", "student_id"],
        },
      ],
    },
  );

  ClassRegistrations.associate = function (models) {
    ClassRegistrations.belongsTo(models.classes, {
      foreignKey: "class_id",
      as: "class",
    });
    ClassRegistrations.belongsTo(models.students, {
      foreignKey: "student_id",
      as: "student",
    });
  };

  return ClassRegistrations;
};
