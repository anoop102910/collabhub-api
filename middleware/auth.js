import jwt from "jsonwebtoken"

export default function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader.substring(7);

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
}
