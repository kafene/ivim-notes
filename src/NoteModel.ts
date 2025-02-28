import { Sequelize, DataTypes, Model } from "sequelize";

export interface NoteInterface {
  id?: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NoteType = {
  id?: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

/* Define the Note model class */
export class Note extends Model<NoteInterface> implements NoteInterface {
  declare id: number;
  declare title: string;
  declare description: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

/* Initialize and export the model */
export const NoteModel = (sequelize: Sequelize) => {
  Note.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  }, {
    sequelize,
    tableName: "notes",
    timestamps: true,
  });

  return Note;
};
