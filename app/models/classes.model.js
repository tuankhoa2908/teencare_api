module.exports = (sequelize, DataTypes) => {
  const Classes = sequelize.define(
    "classes",
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
      subject: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      day_of_week: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "e.g. Monday, Tuesday, ...",
      },
      time_slot: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "e.g. 08:00-09:30",
      },
      teacher_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      max_students: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
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
      tableName: "classes",
      timestamps: false,
    },
  );

  Classes.associate = function (models) {
    Classes.hasMany(models.class_registrations, {
      foreignKey: "class_id",
      as: "registrations",
    });
  };

  return Classes;
};
