import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { loginSchema, refreshSchema, registerSchema } from './auth.validator';
import { loginAuthUser, registerAuthUser, validateToken } from './auth.service';

export async function registerController(req: Request, res: Response) {
  try {
    const payload = registerSchema.parse(req.body);
    const session = await registerAuthUser(payload.name, payload.email, payload.password);

    return res.status(201).json({
      message: 'Usuario creado correctamente.',
      user: session.user,
      token: session.accessToken,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const payload = loginSchema.parse(req.body);
    const session = await loginAuthUser(payload.email, payload.password);

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      user: session.user,
      token: session.accessToken,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message });
    }
  }
}

export async function refreshController(req: Request, res: Response) {
  try {
    const payload = refreshSchema.parse(req.body);
    const decoded = validateToken(payload.refreshToken);

    return res.status(200).json({
      message: 'Token renovado.',
      user: {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
      },
      accessToken: payload.refreshToken,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido o expirado.' });
  }
}

export async function meController(req: AuthenticatedRequest, res: Response) {
  const user = req.user;

  return res.status(200).json({
    message: 'Usuario autenticado.',
    user,
  });
}
