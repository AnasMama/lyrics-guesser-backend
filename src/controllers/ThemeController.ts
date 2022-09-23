import { Request, RequestHandler, Response } from "express";
import { Error } from ".";
import { ThemeManager } from "../models";

export default class ThemeController {
  static browse: RequestHandler = (req: Request, res: Response) => {
    ThemeManager.findAll()
      .then((result) => res.status(200).send(result))
      .catch((err: Error) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
}
