import { Request, RequestHandler, Response } from "express";
import { Error } from ".";
import { ScoreManager } from "../models";

export default class ScoreController {
  static browse: RequestHandler = (req: Request, res: Response) => {
    ScoreManager.findAll()
      .then((result) => res.status(200).send(result))
      .catch((err: Error) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static browseByTheme: RequestHandler = (req: Request, res: Response) => {
    const themeId = parseInt(req.params.theme);
    ScoreManager.findByTheme(themeId)
      .then((result) => res.status(200).send(result))
      .catch((err: Error) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static addOrUpScore: RequestHandler = (req: Request, res: Response) => {
    const { theme_id, user_id, highscore } = req.body;

    Promise.all([
      ScoreManager.validate(req.body),
      ScoreManager.findOne(user_id, theme_id),
    ])
      .then(([validationError, score]) => {
        if (validationError) return Promise.reject("Mauvaise données entrées");
        if (!score[0])
          return ScoreManager.insert(req.body)
            .then((result) => res.status(200).send(result))
            .catch((err: Error) => {
              console.error(err);
              res.sendStatus(500);
            });
        if (score[0].highscore < highscore)
        return ScoreManager.update(req.body)
          .then((result) => res.status(200).send(result))
          .catch((err: Error) => {
            console.error(err);
            res.sendStatus(500);
          });
        return res.status(200).send("Score vérifié mais inchangé")
      })
      .catch((err: Error) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
}
