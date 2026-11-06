"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../utils/jwt");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token faltante o inválido.' });
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = {
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
        };
        return next();
    }
    catch {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
}
