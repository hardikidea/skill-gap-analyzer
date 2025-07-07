import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface ResumeAttributes {
  id: string;
  userId?: string;
  fileName: string;
  type: 'resume' | 'jd';
  extractedText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ResumeCreationAttributes = Optional<ResumeAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Resume extends Model<ResumeAttributes, ResumeCreationAttributes> implements ResumeAttributes {
  public id!: string;
  public userId?: string;
  public fileName!: string;
  public type!: 'resume' | 'jd';
  public extractedText?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Resume {
  Resume.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false
        },
        fileName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false
        },
        extractedText: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'Resume',
        tableName: 'Resumes',
        timestamps: true
      }
  );

  return Resume;
}
