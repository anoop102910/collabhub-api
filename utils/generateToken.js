import jwt from "jsonwebtoken"

export function generateToken({userId,username}){
    const token = jwt.sign({ userId,username}, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
    return token;
}