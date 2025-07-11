// migrations/xxxxxxxxxxxxxx-create-officers-table.js
const { DataTypes } = require('sequelize'); // Use require

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("officers", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactInfo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive", "On Leave"),
        defaultValue: "Active",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("officers");
  },
};
