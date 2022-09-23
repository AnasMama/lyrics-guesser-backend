import { Request, RequestHandler, Response } from "express";
import { Error } from ".";
import { SongManager } from "../models";

export default class SongController {
  static browse: RequestHandler = (req: Request, res: Response) => {
    SongManager.findAll()
      .then((result) => res.status(200).send(result))
      .catch((err: Error) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static browseByTheme: RequestHandler = (req: Request, res: Response) => {
    const themeId = parseInt(req.params.theme);
    SongManager.findByTheme(themeId)
      .then((result) => res.status(200).send(result))
      .catch((err: Error) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
}

