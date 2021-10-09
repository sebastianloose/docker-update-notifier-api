import jwt from "jsonwebtoken";

const secret = process.env["JWT_SECRET"] as string;

const generateToken = (uuid: string) => {
  return jwt.sign({ uuid }, secret, {
    expiresIn: "1h",
  });
};

const verifyToken = (token: string) => {
  console.log(jwt.verify(token, secret));
};

export { generateToken, verifyToken };
