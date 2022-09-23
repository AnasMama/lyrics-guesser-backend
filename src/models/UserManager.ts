import Joi from "joi";
import AbstractManager from "./AbstractManager";

export interface User {
  id: number;
  login: string;
  password: string;
}

export default class UserManager extends AbstractManager {
  static table = "user";

  static async findByLogin(login: string): Promise<User[]> {
    return (await this.connection)
      .query(`SELECT * FROM ${UserManager.table} WHERE login = ?`, [login])
      .then((result) => {
        const users = result[0] as unknown as User[];
        return users;
      });
  }

  static async insert(user: User) {
    return (await this.connection).query(
      `INSERT INTO ${UserManager.table} SET ?`,
      [user]
    );
  }

  static async validate(data: User, forCreation: boolean = true) {
    const presence = forCreation ? "required" : "optional";
    return await Joi.object({
      login: Joi.string().max(45).presence(presence),
      password: Joi.string().min(8).max(255).presence(presence),
    }).validate(data, { abortEarly: false }).error;
  }
}
