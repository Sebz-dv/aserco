"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.refreshController = refreshController;
exports.meController = meController;
const auth_validator_1 = require("./auth.validator");
const auth_service_1 = require("./auth.service");
async function registerController(req, res) {
    try {
        const payload = auth_validator_1.registerSchema.parse(req.body);
        const session = await (0, auth_service_1.registerAuthUser)(payload.name, payload.email, payload.password);
        return res.status(201).json({
            message: 'Usuario creado correctamente.',
            user: session.user,
            token: session.accessToken,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
async function loginController(req, res) {
    try {
        const payload = auth_validator_1.loginSchema.parse(req.body);
        const session = await (0, auth_service_1.loginAuthUser)(payload.email, payload.password);
        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            user: session.user,
            token: session.accessToken,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(401).json({ message: error.message });
        }
    }
}
async function refreshController(req, res) {
    try {
        const payload = auth_validator_1.refreshSchema.parse(req.body);
        const decoded = (0, auth_service_1.validateToken)(payload.refreshToken);
        return res.status(200).json({
            message: 'Token renovado.',
            user: {
                id: decoded.sub,
                name: decoded.name,
                email: decoded.email,
            },
            accessToken: payload.refreshToken,
        });
    }
    catch (error) {
        return res.status(401).json({ message: 'Refresh token inválido o expirado.' });
    }
}
async function meController(req, res) {
    const user = req.user;
    return res.status(200).json({
        message: 'Usuario autenticado.',
        user,
    });
}
