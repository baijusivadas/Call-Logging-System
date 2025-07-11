const { DataTypes } = require("sequelize");

// Define the Call model
module.exports = (sequelize) => {
  const Call = sequelize.define(
    "Call",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      officerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "officers", // Refers to the 'officers' table
          key: "id",
        },
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: true, // A call might not always be linked to a specific client (e.g., internal calls)
        references: {
          model: "clients", // Refers to the 'clients' table
          key: "id",
        },
      },
      duration: {
        type: DataTypes.INTEGER, // Duration in seconds
        allowNull: false,
        defaultValue: 0,
      },
      callType: {
        type: DataTypes.ENUM("Incoming", "Outgoing"),
        allowNull: false,
      },
      callOutcome: {
        type: DataTypes.ENUM(
          "Successful",
          "Missed",
          "Follow-up",
          "No Answer",
          "Busy",
          "Other"
        ),
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Default to current timestamp
      },
    },
    {
      tableName: "calls", // Explicitly define table name
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );

  // Define associations
  Call.associate = (models) => {
    // A Call belongs to an Officer
    Call.belongsTo(models.Officer, {
      foreignKey: "officerId",
      as: "officer",
    });
    // A Call belongs to a Client
    Call.belongsTo(models.Client, {
      foreignKey: "clientId",
      as: "client",
    });
  };

  return Call;
};
