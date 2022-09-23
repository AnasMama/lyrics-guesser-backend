import { Router } from 'express';
import { ScoreController, SongController, ThemeController, UserController } from "./controllers";
import { authorization } from './services/auth';

const router = Router();

router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/users", UserController.browse);
router.get("/users/logout", UserController.logout);
router.delete("/users/:id", UserController.delete);

router.get("/themes", ThemeController.browse);

router.get("/themes/:theme/songs", SongController.browseByTheme);

router.get("/themes/:theme/scores", ScoreController.browseByTheme);
router.post("/scores", authorization, ScoreController.addOrUpScore);

export default router;