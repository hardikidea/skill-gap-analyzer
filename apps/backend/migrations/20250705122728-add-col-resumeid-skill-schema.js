'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Add resumeId column
    await queryInterface.addColumn('Skills', 'resumeId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Resumes',
        key: 'id'
      },
      onDelete: 'NO ACTION', // or 'CASCADE' based on your requirements
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Skills', 'resumeId');
  }
};
