import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Expected format: "Bearer <token>"
    const secret = process.env.JWT_SECRET || 'super_secret_retro_key_95';
    
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid authorization token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized: Missing authorization header' });
  }
};
