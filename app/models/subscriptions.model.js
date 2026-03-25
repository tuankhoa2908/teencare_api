module.exports = (sequelize, DataTypes) => {
  const Subscriptions = sequelize.define(
    "subscriptions",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      package_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      total_sessions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      used_sessions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: "subscriptions",
      timestamps: false,
    },
  );

  Subscriptions.associate = function (models) {
    Subscriptions.belongsTo(models.students, {
      foreignKey: "student_id",
      as: "student",
    });
  };

  return Subscriptions;
};
