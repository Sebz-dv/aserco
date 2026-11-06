import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token faltante o inválido.' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
    };

    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}
