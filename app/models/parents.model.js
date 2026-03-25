module.exports = (sequelize, DataTypes) => {
  const Parents = sequelize.define(
    "parents",
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
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
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
      tableName: "parents",
      timestamps: false,
    },
  );

  Parents.associate = function (models) {
    Parents.hasMany(models.students, {
      foreignKey: "parent_id",
      as: "students",
    });
  };

  return Parents;
};
