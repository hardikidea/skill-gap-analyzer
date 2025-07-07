'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
  await queryInterface.createTable('JobExperienceSkills', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()') // or Sequelize.UUIDV4 if your DB supports it
    },
    jobExperienceId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'JobExperiences',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    skillId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Skills',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
},

down: async (queryInterface) => {
  await queryInterface.dropTable('JobExperienceSkills');
}
};
