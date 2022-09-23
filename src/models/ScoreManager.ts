import Joi from "joi";
import AbstractManager from "./AbstractManager";

export interface Score {
  highscore: number;
  user_id: number;
  theme_id: number;
}

export default class ScoreManager extends AbstractManager {
  static table = "user_has_theme";

  static async insert(score: Score) {
    return (await this.connection).query(
      `INSERT INTO ${ScoreManager.table} SET ?`,
      [score]
    );
  }

  static async update(score: Score) {
      const { user_id, theme_id } = score;
    return (await this.connection).query(
      `UPDATE ${ScoreManager.table} SET ? WHERE user_id = ? AND theme_id = ?`,
      [score, user_id, theme_id]
    );
  }

  static async findByTheme(theme_id: number) {
    return (await this.connection).query(
      `SELECT u.login, s.* FROM  ${this.table} s JOIN user u ON u.id = s.user_id WHERE theme_id = ? ORDER BY highscore DESC LIMIT 10`,
      [theme_id]
    ).then((result) => {
        const songs = result as unknown as Score[][];
        return songs[0]
      });
  }

  static async findOne(user_id: number, theme_id: number) {
    return (await this.connection).query(
      `SELECT * FROM  ${this.table} WHERE user_id = ? AND theme_id = ?`,
      [user_id, theme_id]
    ).then((result) => {
        const items = result as unknown as any[];
        return items[0]
      });
  }

  static async findHighscoreOfAUser(theme_id: number) {
    return (await this.connection).query(
      `SELECT * FROM  ${this.table} WHERE user_id = ? ORDER BY highscore DESC`,
      [theme_id]
    ).then((result) => {
        const songs = result as unknown as Score[][];
        return songs[0][0]
      });
  }

  static validate(data: Score, forCreation: boolean = true) {
    const presence = forCreation ? "required" : "optional";
    return Joi.object({
        highscore: Joi.number().presence(presence),
        user_id: Joi.number().presence(presence),
        theme_id: Joi.number().presence(presence),
    }).validate(data, { abortEarly: false }).error;
  }
}
