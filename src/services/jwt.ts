import jwt from "jsonwebtoken";

const secret = process.env["JWT_SECRET"] as string;

declare module "jsonwebtoken" {
  export interface UuidJwtPayload extends jwt.JwtPayload {
    uuid: string;
  }
}

const generateToken = (uuid: string) => {
  return jwt.sign({ uuid }, secret, {
    expiresIn: "7d",
  });
};

const verifyToken = (token: string) => {
  const { uuid } = <jwt.UuidJwtPayload>jwt.verify(token, secret);
  return uuid;
};

export { generateToken, verifyToken };
