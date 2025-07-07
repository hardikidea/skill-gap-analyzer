import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  Association
} from 'sequelize';
import type { JobExperience } from './jobExperience.model';
import type { Skill } from './skill.model';

interface JobExperienceSkillAttributes {
  id?: string;
  jobExperienceId: string;
  skillId: string;
}

export type JobExperienceSkillCreationAttributes = Optional<JobExperienceSkillAttributes, 'id'>;

export class JobExperienceSkill extends Model<
    JobExperienceSkillAttributes,
    JobExperienceSkillCreationAttributes
> implements JobExperienceSkillAttributes {
  public id!: string;
  public jobExperienceId!: string;
  public skillId!: string;

  // Optional direct references (if you use eager loading)
  public readonly JobExperience?: JobExperience;
  public readonly Skill?: Skill;

  public static associations: {
    JobExperience: Association<JobExperienceSkill, JobExperience>;
    Skill: Association<JobExperienceSkill, Skill>;
  };

  static associate(models: {
    JobExperience: typeof JobExperience;
    Skill: typeof Skill;
  }) {
    JobExperienceSkill.belongsTo(models.JobExperience, {
      foreignKey: 'jobExperienceId',
      as: 'jobExperience'
    });

    JobExperienceSkill.belongsTo(models.Skill, {
      foreignKey: 'skillId',
      as: 'skill'
    });
  }
}

export default function (sequelize: Sequelize): typeof JobExperienceSkill {
  JobExperienceSkill.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        jobExperienceId: { type: DataTypes.UUID, allowNull: false },
        skillId: { type: DataTypes.UUID, allowNull: false }
      },
      {
        sequelize,
        modelName: 'JobExperienceSkill',
        tableName: 'JobExperienceSkills',
        timestamps: true
      }
  );

  return JobExperienceSkill;
}
