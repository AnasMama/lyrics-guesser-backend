import Joi from "joi";
import AbstractManager from "./AbstractManager";

export interface Theme {
  id: number;
  theme: string;
}

export default class ThemeManager extends AbstractManager {
  static table = "theme";

  static async insert(theme: Theme) {
    return (await this.connection).query(
      `INSERT INTO ${ThemeManager.table} SET ?`,
      [theme]
    );
  }

  static async validate(data: Theme, forCreation: boolean = true) {
    const presence = forCreation ? "required" : "optional";
    return await Joi.object({
      theme: Joi.string().max(255).presence(presence),
    }).validate(data, { abortEarly: false }).error;
  }
}
