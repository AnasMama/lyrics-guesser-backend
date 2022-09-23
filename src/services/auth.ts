import { Request, Response, NextFunction } from "express";
import { User } from "../models/UserManager";
import * as jwt from "jsonwebtoken";

interface RequestAuth extends Request {
  user_id: string;
  theme_id: string;
}

interface Decoded extends jwt.JwtPayload {
  id: string;
}

const secret = process.env.JWT_AUTH_SECRET;

const generateToken = (user: User) => {
  const { id, login } = user;
  if (secret) return jwt.sign({ id, login }, secret, { expiresIn: "1h" });
};

const authorization = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.cookie?.split("=")[1];

  console.log("token", req.headers)
  if (!token) return res.status(401).send("aucun token");
  // var decoded = jwt.decode(token);

  // get the decoded payload and header
  const decoded = jwt.decode(token, { complete: true }) as unknown as jwt.Jwt;
  console.log(decoded)
  const decodedPayload = decoded?.payload as unknown as Decoded;
  const decodedId: string = decodedPayload.id;

  console.log("id decode", decodedId, "body id", req.body.user_id)
  if (decodedId !== req.body.user_id){
    return res.status(403).send("Vous n'avez pas le droit");
  }
  
  try {
    if (secret) {
      const data = jwt.verify(token, secret);
      // if (typeof data !== "string") {
      //   req.user_id = data.id;
      // }
    }
    return next();
  } catch {
    return res.status(401).send("token non décodé");
  }
};

export { generateToken, authorization };
