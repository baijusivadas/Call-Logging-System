import { DataTypes } from 'sequelize';

// Define the Officer model
export default (sequelize) => {
  const Officer = sequelize.define('Officer', {
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
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING, // Hashed password
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
      type: DataTypes.ENUM('Active', 'Inactive', 'On Leave'),
      defaultValue: 'Active',
      allowNull: false,
    },
  }, {
    tableName: 'officers', // Explicitly define table name
    timestamps: true, // Adds createdAt and updatedAt fields
  });

  // Define associations
  Officer.associate = (models) => {
    // An Officer can have many Calls
    Officer.hasMany(models.Call, {
      foreignKey: 'officerId',
      as: 'calls',
      onDelete: 'CASCADE', // If an officer is deleted, their calls are also deleted
    });
  };

  return Officer;
};