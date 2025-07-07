import {
    Sequelize,
    DataTypes,
    Model,
    Association,
    BelongsToGetAssociationMixin,
    BelongsToManyGetAssociationsMixin
} from 'sequelize';

import type { Resume } from './resume.model';
import type { JobExperience } from './jobExperience.model';
import type { JobExperienceSkill } from './jobExperienceSkill.model';

export class Skill extends Model {
    public id!: string;
    public name!: string;
    public type!: string;
    public source!: string;
    public mapped_ESCO!: string;
    public resumeId!: string;

    // Optional direct references (eager loading)
    public readonly resume?: Resume;
    public readonly jobExperiences?: JobExperience[];

    // Mixins for magic methods
    public getResume!: BelongsToGetAssociationMixin<Resume>;
    public getJobExperiences!: BelongsToManyGetAssociationsMixin<JobExperience>;

    // Static association references
    public static associations: {
        resume: Association<Skill, Resume>;
        jobExperiences: Association<Skill, JobExperience>;
    };

    static associate(models: {
        Resume: typeof Resume;
        JobExperience: typeof JobExperience;
        JobExperienceSkill: typeof JobExperienceSkill;
    }) {
        // Many-to-one: Skill → Resume
        Skill.belongsTo(models.Resume, {
            foreignKey: 'resumeId',
            as: 'resume'
        });

        // Many-to-many: Skill ↔ JobExperience through JobExperienceSkill
        Skill.belongsToMany(models.JobExperience, {
            through: models.JobExperienceSkill,
            foreignKey: 'skillId',
            otherKey: 'jobExperienceId',
            as: 'jobExperiences'
        });
    }
}

export default function (sequelize: Sequelize): typeof Skill {
    Skill.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            source: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mapped_ESCO: {
                type: DataTypes.STRING,
                allowNull: false
            },
            resumeId: {
                type: DataTypes.UUID,              // ✅ Correct UUID foreign key
                allowNull: false,
                references: {
                    model: 'Resumes',                // 🔗 must match DB table name
                    key: 'id'
                },
                // onDelete: 'CASCADE',
                // onUpdate: 'CASCADE'
            }
        },
        {
            sequelize,
            modelName: 'Skill',
            tableName: 'Skills',
            timestamps: true
        }
    );

    return Skill;
}
