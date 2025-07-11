const { DataTypes } = require("sequelize");

// Define the Client model
module.exports = (sequelize) => {
  const Client = sequelize.define("Client", {
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
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive', 'Lead', 'Converted'),
      defaultValue: 'Active',
      allowNull: false,
    },
  }, {
    tableName: 'clients', // Explicitly define table name
    timestamps: true, // Adds createdAt and updatedAt fields
  });

  // Define associations
  Client.associate = (models) => {
    // A Client can have many Calls
    Client.hasMany(models.Call, {
      foreignKey: 'clientId',
      as: 'calls',
      onDelete: 'SET NULL', // If a client is deleted, calls associated with them will have clientId set to NULL
    });
  };

  return Client;
};
