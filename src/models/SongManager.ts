import Joi from "joi";
import AbstractManager from "./AbstractManager";

export interface Song {
  id: number;
  title: string;
  lyrics: string;
  img?: string;
  link?: string;
  theme_id: number;
}

export default class SongManager extends AbstractManager {
  static table = "song";

  static async insert(song: Song) {
    return (await this.connection).query(
      `INSERT INTO ${SongManager.table} SET ?`,
      [song]
    );
  }

  static async findByTheme(theme_id: number) {
    return (await this.connection).query(
      `SELECT * FROM ${this.table} WHERE theme_id = ?`,
      [theme_id]
    ).then((result) => {
        const songs = result as unknown as Song[][];
        return songs[0]
      });
  }

  static async validate(data: Song, forCreation: boolean = true) {
    const presence = forCreation ? "required" : "optional";
    return await Joi.object({
      song: Joi.string().max(255).presence(presence),
      title: Joi.string().max(255).presence(presence),
      lyrics: Joi.string().max(255).presence(presence),
      img: Joi.string().max(255),
      link: Joi.string().max(255),
      theme_id: Joi.number().presence(presence),
    }).validate(data, { abortEarly: false }).error;
  }
}
