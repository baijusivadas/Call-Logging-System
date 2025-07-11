const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calls', {
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
          model: 'officers', // Refers to the 'officers' table
          key: 'id',
        },
        onUpdate: 'CASCADE', // Update foreign key if officer ID changes
        onDelete: 'CASCADE', // Delete calls if officer is deleted
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: true, // A call might not always be linked to a specific client
        references: {
          model: 'clients', // Refers to the 'clients' table
          key: 'id',
        },
        onUpdate: 'CASCADE', // Update foreign key if client ID changes
        onDelete: 'SET NULL', // Set clientId to NULL if client is deleted
      },
      duration: {
        type: DataTypes.INTEGER, // Duration in seconds
        allowNull: false,
        defaultValue: 0,
      },
      callType: {
        type: DataTypes.ENUM('Incoming', 'Outgoing'),
        allowNull: false,
      },
      callOutcome: {
        type: DataTypes.ENUM('Successful', 'Missed', 'Follow-up', 'No Answer', 'Busy', 'Other'),
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    }, {
      // Add indexes for performance optimization
      indexes: [
        {
          fields: ['officerId'], // Index for filtering by officer
        },
        {
          fields: ['clientId'], // Index for filtering by client
        },
        {
          fields: ['timestamp'], // Index for time-based queries (daily/monthly volumes)
        },
        {
          // Composite index for common officer + time range queries
          fields: ['officerId', 'timestamp'],
        },
      ]
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('calls');
  }
};