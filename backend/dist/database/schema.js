"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableDefinitions = void 0;
exports.initializeSchema = initializeSchema;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const DEFAULT_ADMIN_EMAIL = 'superadmin@aserco.com.co';
const DEFAULT_ADMIN_PASSWORD = 'SuperAdmin123!';
exports.tableDefinitions = [
    `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(180) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
    `
    CREATE TABLE IF NOT EXISTS roles (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(80) NOT NULL UNIQUE,
      description VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
    `
    CREATE TABLE IF NOT EXISTS permissions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(80) NOT NULL UNIQUE,
      description VARCHAR(255) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
    `
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id INT NOT NULL,
      role_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, role_id),
      CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    )
  `,
    `
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id INT NOT NULL,
      permission_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (role_id, permission_id),
      CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    )
  `,
    `
    CREATE TABLE IF NOT EXISTS sessions (
      id CHAR(36) PRIMARY KEY,
      user_id INT NOT NULL,
      refresh_token_hash VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      revoked_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
];
async function seedRolesAndPermissions() {
    const roles = [
        { name: 'super_admin', description: 'Super administrador del sistema' },
        { name: 'admin', description: 'Administrador general' },
    ];
    const permissions = [
        { name: 'users.read', description: 'Leer usuarios' },
        { name: 'users.write', description: 'Crear y editar usuarios' },
        { name: 'users.delete', description: 'Eliminar usuarios' },
        { name: 'roles.manage', description: 'Administrar roles' },
        { name: 'permissions.manage', description: 'Administrar permisos' },
    ];
    for (const role of roles) {
        await database_1.pool.query('INSERT INTO roles (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)', [role.name, role.description]);
    }
    for (const permission of permissions) {
        await database_1.pool.query('INSERT INTO permissions (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description)', [permission.name, permission.description]);
    }
    const [[superAdminRole]] = (await database_1.pool.query('SELECT id FROM roles WHERE name = ? LIMIT 1', ['super_admin']));
    const [[usersReadPermission]] = (await database_1.pool.query('SELECT id FROM permissions WHERE name = ? LIMIT 1', ['users.read']));
    if (superAdminRole && usersReadPermission) {
        await database_1.pool.query('INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [superAdminRole.id, usersReadPermission.id]);
    }
}
async function seedSuperAdminUser() {
    const passwordHash = await bcryptjs_1.default.hash(DEFAULT_ADMIN_PASSWORD, 10);
    const [existing] = (await database_1.pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [DEFAULT_ADMIN_EMAIL]));
    if (existing.length > 0) {
        return;
    }
    const [result] = (await database_1.pool.query('INSERT INTO users (name, email, password_hash, is_active) VALUES (?, ?, ?, 1)', ['Super Admin', DEFAULT_ADMIN_EMAIL, passwordHash]));
    const [[superAdminRole]] = (await database_1.pool.query('SELECT id FROM roles WHERE name = ? LIMIT 1', ['super_admin']));
    if (superAdminRole) {
        await database_1.pool.query('INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)', [result.insertId, superAdminRole.id]);
    }
}
async function initializeSchema() {
    for (const statement of exports.tableDefinitions) {
        await database_1.pool.query(statement);
    }
    await seedRolesAndPermissions();
    await seedSuperAdminUser();
    console.log('Esquema inicial verificado.');
    console.log(`Usuario administrador creado: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`);
}
