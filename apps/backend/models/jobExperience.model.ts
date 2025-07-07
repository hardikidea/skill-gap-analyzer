import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import {Resume} from "./resume.model";

export interface JobExperienceAttributes {
  id: string;
  resumeId: string;
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  skills?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type JobExperienceCreationAttributes = Optional<JobExperienceAttributes, 'id' | 'endDate' | 'skills' | 'createdAt' | 'updatedAt'>;

export class JobExperience extends Model<JobExperienceAttributes, JobExperienceCreationAttributes>
    implements JobExperienceAttributes {
  public id!: string;
  public resumeId!: string;
  public jobTitle!: string;
  public company!: string;
  public startDate!: Date;
  public endDate?: Date;
  public isCurrent!: boolean;
  public skills?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Optional associations
  static associate(models: { Resume: typeof Resume }) {
    JobExperience.belongsTo(models.Resume, {
      foreignKey: 'resumeId',
      as: 'resume'
    });
  }
}

export default function (sequelize: Sequelize): typeof JobExperience {
  JobExperience.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
        },
        resumeId: {
          type: DataTypes.UUID,
          allowNull: false
        },
        jobTitle: {
          type: DataTypes.STRING,
          allowNull: false
        },
        company: {
          type: DataTypes.STRING,
          allowNull: false
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true
        },
        isCurrent: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        skills: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'JobExperience',
        tableName: 'JobExperiences',
        timestamps: true
      }
  );

  return JobExperience;
}
