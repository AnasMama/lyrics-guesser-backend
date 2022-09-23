import { Request, RequestHandler, Response } from "express";
import { UserManager } from "../models";
import { User } from "../models/UserManager";
import * as argon2 from "argon2";
import { generateToken } from "../services/auth";
import Joi from "joi";
import { Error } from ".";

export default class UserController {
  static register: RequestHandler = async (req: Request, res: Response) => {
    const { login, password } = req.body;
    if (!login) {
      if (!password) {
        return res.status(500).send({
          error: "Login and password missing",
        });
      }
      return res.status(500).send({
        error: "Login missing",
      });
    }
    if (!password)
      return res.status(500).send({
        error: "Password missing",
      });

    Promise.all([UserManager.findByLogin(login), argon2.hash(password)]).then(
      ([existingLogin, hashPassword]) => {
        if (existingLogin[0])
          return res.status(403).send({
            error: "Login already used",
          });
        UserManager.insert({ ...req.body, password: hashPassword })
          .then(([result]: any) => {
            res.status(201).send({
              id: result.insertId,
              login: login,
            });
          })
          .catch((err: Error) => {
            console.error(err);
            res.status(500).send({
              error: err.message,
            });
          });
      }
    );
  };

  static login: RequestHandler = (req: Request, res: Response) => {
    const { login, password } = req.body;

    if (!login) {
      if (!password) {
        return res.status(500).send({
          error: "Login and password missing",
        });
      }
      return res.status(500).send({
        error: "Login missing",
      });
    }
    if (!password)
      return res.status(500).send({
        error: "Password missing",
      });

    UserManager.findByLogin(login)
      .then((existingLogin) => {
        if (!existingLogin[0]) {
          return res.status(500).send({
            error: "Login isn't registered",
          });
        } else {
          const { id, login, password: hash } = existingLogin[0];
          argon2.verify(hash, password).then((passVerified: boolean) => {
            if (!passVerified)
              return res.status(403).send({
                error: "Wrong password",
              });
            const token = generateToken(existingLogin[0]);
            return res
              .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              })
              .status(200)
              .send({
                id,
                login,
              });
          });
        }
      })
      .catch((err: Error) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  static browse: RequestHandler = (req: Request, res: Response) => {
    UserManager.findAll()
      .then((result) => res.status(200).send(result))
      .catch((err: Error) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static logout: RequestHandler = (req: Request, res: Response) => {
    return res.clearCookie("access_token").sendStatus(200);
  };

  static delete: RequestHandler = (req: Request, res: Response) => {
    UserManager.delete(parseInt(req.params.id, 10))
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err: Error) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
}
