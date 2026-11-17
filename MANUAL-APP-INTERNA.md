# Manual funcional y técnico (sin landing)

## 1. Alcance de este manual
Este documento resume todo lo implementado en la aplicación interna, excluyendo la landing pública.

Incluye:
- Autenticación y sesión.
- Enrutamiento interno.
- Dashboard administrativo.
- Gestión de usuarios, roles y permisos.
- Módulo de conocimiento en modo usuario y administración.
- Módulo de perfil de usuario (propio y edición por administrador).
- Comportamientos de UI/UX aplicados recientemente.
- Integración con API y manejo de errores de sesión.

No incluye:
- Secciones de marketing/landing (hero, servicios, CTA, footer público, etc.).

## 2. Arquitectura general de la SPA
La aplicación funciona como una SPA en React + TypeScript con Vite.

### 2.1 Punto de orquestación
- Archivo principal: src/App.tsx
- Responsabilidades:
1. Resolver vista activa según hash de URL.
2. Sincronizar usuario autenticado en cliente.
3. Gestionar tema claro/oscuro.
4. Gestionar notificaciones (toasts).
5. Manejar expiración de sesión (evento global de no autorizado).

### 2.2 Vistas internas
Las vistas principales internas son:
- Auth: login y registro.
- Admin: dashboard administrativo.
- Profile: perfil de usuario.
- Knowledge: hub de conocimiento.
- Knowledge article: detalle de artículo.
- Not found: fallback para rutas no válidas.

## 3. Enrutamiento interno (hash routing)
Se usa enrutamiento por hash en App.tsx.

Rutas relevantes:
- #login / #auth
- #register
- #admin
- #admin/conocimiento
- #perfil / #profile / #mi-perfil
- #conocimiento
- #conocimiento/articulo/:slug

Comportamiento:
1. Si la ruta requiere autenticación y no hay usuario, redirige a #login.
2. Si la ruta no existe, muestra vista 404.

## 4. Autenticación y sesión
### 4.1 Flujo de autenticación
- Archivo UI: src/pages/AuthPage.tsx
- API: src/lib/api.ts (loginUser, registerUser, getCurrentUser, logoutUser)

Funciones implementadas:
1. Login con email y contraseña.
2. Registro con validación de contraseña fuerte.
3. Toggle visual de contraseña.
4. Estados de envío, errores y feedback por toast.

### 4.2 Persistencia de sesión en cliente
- Usuario guardado en localStorage con clave aserco-auth-user.
- Tema guardado en localStorage con clave aserco-theme.

### 4.3 Sincronización con backend
En App.tsx se hace sync con endpoint de sesión para obtener usuario real al iniciar.

### 4.4 Sesión expirada
- Implementado un evento global de no autorizado: aserco:unauthorized.
- Al recibir 401 desde API:
1. Se limpia usuario.
2. Se redirige a #login.
3. Se notifica al usuario con toast de sesión expirada.

## 5. Capa API y normalización
Archivo central: src/lib/api.ts

### 5.1 Cliente HTTP
Se centraliza con funciones internas:
- fetchJson
- fetchMultipart

Características:
1. Envío de cookies con credentials include.
2. Manejo de error tipado con ApiError.
3. Disparo de evento global en 401.

### 5.2 Tipos y contratos
Se definieron/extendieron tipos para:
- AuthUser
- UserProfile
- CompanyProfile
- AdminUser, AdminRole, AdminModule, PermissionItem
- Entidades de conocimiento

### 5.3 Normalización de respuestas
Se implementó normalización robusta para perfiles:
- Acepta variantes de nombres de campos entre backend y frontend.
- Normaliza avatarUrl, defaultAvatarUrl y hasCustomAvatar.
- Normaliza estructura de empresa asociada al perfil.

## 6. Dashboard administrativo
Archivo contenedor: src/pages/AdminPage.tsx

### 6.1 Funcionalidad general
El dashboard administra secciones por estado local:
- overview
- users
- roles
- knowledge
- profile

### 6.2 Permisos y acceso
- Valida acceso administrativo por roles/permisos.
- Muestra pantalla de acceso restringido si no cumple condiciones.

### 6.3 Datos cargados
Carga en paralelo:
- Usuarios.
- Roles.
- Módulos.
- Permisos.
- Permisos por rol.

### 6.4 Operaciones administrativas
1. Activar/desactivar usuarios.
2. Cambiar roles de usuario.
3. Crear usuario.
4. Crear rol.
5. Crear módulo.
6. Crear permiso.
7. Asignar o retirar permisos por rol.

## 7. Sidebar administrativo
Componente: src/components/organisms/DashboardSidebar.tsx

### 7.1 Orden funcional aplicado
Orden de navegación ajustado según requerimientos:
1. Inicio (principal dashboard).
2. Conocimiento.
3. Mi perfil.
4. Ajustes (submenú):
- Usuarios.
- Roles y permisos.
5. Cerrar sesión al final.

### 7.2 Ajustes como submenú real
- Ajustes funciona como bloque desplegable.
- Usuarios y Roles y permisos se muestran anidados visualmente.

### 7.3 Comportamiento del submenú
1. En sidebar expandido:
- Se despliega debajo de Configuración.
- Se cierra al seleccionar una opción.
2. En sidebar contraído:
- Se abre como panel flotante.
- Reposicionamiento dinámico para no salir del viewport:
  - Ajusta verticalmente (si no cabe hacia abajo).
  - Cambia a lado izquierdo si no hay espacio a la derecha.
  - Tiene altura máxima y scroll interno.
- Se cierra al salir el mouse del área.

### 7.4 Tooltips en modo colapsado
- Tooltips por ítem con cálculo de posición por getBoundingClientRect.
- Render por portal para evitar clipping.

### 7.5 Avatar en Mi perfil (sidebar)
- Si hay imagen de avatar, se muestra en el ítem Mi perfil.
- Fallback a ícono si no hay imagen o falla carga.
- Si el objeto de sesión no trae avatar, se hidrata desde endpoint de perfil propio.

### 7.6 Botón de apertura del sidebar
- Se removió el botón local de abrir/cerrar en el sidebar.
- El control de tipo hamburguesa queda en contexto móvil según el flujo general.

## 8. Navbar del dashboard
Componente: src/components/organisms/DashboardNavbar.tsx

Cambios aplicados:
1. Altura alineada con el header del sidebar (h 76px).
2. Microanimaciones sutiles en botones (hover/focus):
- Elevación ligera.
- Sombra suave.
- Transiciones de color y borde.

## 9. Módulo de perfil de usuario
Componente principal: src/pages/UserProfilePage.tsx

### 9.1 Modos de uso
1. Modo self: usuario edita su propio perfil.
2. Modo admin: administrador edita perfil de otro usuario.

### 9.2 Secciones del perfil
Por pestañas:
- Personal.
- Empresarial.
- Comercial.
- Seguridad.

### 9.3 Capacidades implementadas
1. Carga de perfil tipada y normalizada.
2. Construcción de payload diferencial (solo campos cambiados).
3. Actualización de datos del perfil.
4. Cambio de contraseña con validaciones.
5. Gestión de avatar:
- Subir avatar.
- Eliminar avatar.
- Fallback de imagen.
- Soporte de URLs relativas y absolutas.

### 9.4 Ajustes de imagen en entorno local
Para evitar bloqueos de recursos en desarrollo:
- Resolución de assets con proxy same-origin cuando aplica en local.
- Estrategia de candidatos de URL y fallback.

## 10. Gestión de usuarios (UI)
Componente: src/pages/AdminUsersPage.tsx

Resumen funcional:
1. Listado de usuarios.
2. Cambio de estado activo/inactivo.
3. Gestión de roles por usuario.
4. Acción para editar perfil de usuario desde admin.

Ajustes visuales relevantes:
- Corrección de contraste en modal de Crear usuario en modo oscuro (incluyendo opciones de select).

## 11. Gestión de roles y permisos (UI)
Componente: src/pages/AdminRolesPage.tsx

Funciones principales:
1. Visualizar roles disponibles.
2. Visualizar permisos disponibles por módulo.
3. Asignar/remover permisos por rol.
4. Alta de módulos y permisos.

## 12. Conocimiento (usuario y admin)
### 12.1 Vista pública de conocimiento
- Página de hub de conocimiento.
- Navegación a detalle de artículo por slug.

### 12.2 Administración de conocimiento
- Integración dentro de AdminPage en sección knowledge.
- Control de acceso para rol editor/permisos de knowledge.

## 13. Notificaciones y confirmaciones
Componente: src/components/organisms/ToastContainer.tsx

Se implementa:
1. Toast informativo, éxito y error.
2. Toast de confirmación para acciones sensibles (ejemplo: cierre de sesión).
3. Cierre automático para tipos no confirmables.

## 14. Tema oscuro y consistencia visual
Se reforzó la consistencia en modo oscuro/claro en:
- Navbar dashboard.
- Sidebar y submenús.
- Formularios de autenticación.
- Modal/inputs de gestión admin.
- Perfil y estados de navegación.

## 15. Accesibilidad y UX aplicadas
Mejoras implementadas:
1. Labels y aria-label en botones clave.
2. Focus ring visible en acciones interactivas.
3. Jerarquía visual por secciones y separadores.
4. Fallbacks de imagen y estado para evitar UI rota.
5. Mensajes de error y estado más claros para usuario final.

## 16. Flujo resumido de uso interno
1. Usuario inicia sesión o se registra.
2. App sincroniza sesión y usuario con backend.
3. Si tiene acceso admin, entra a dashboard.
4. Navega por Inicio, Conocimiento, Perfil y Ajustes.
5. Ajustes permite gestionar usuarios, roles y permisos.
6. Perfil permite actualizar datos, contraseña y avatar.
7. Si la sesión expira, se redirige a login de forma automática.

## 17. Validación técnica realizada
Durante los cambios se validó en múltiples iteraciones con build de producción:
- Comando: npm run build
- Estado actual: compila correctamente.

Advertencia no bloqueante observada:
- Algunos bundles superan 500 kB tras minificación (warning de Vite).

## 18. Archivos clave involucrados
- src/App.tsx
- src/lib/api.ts
- src/pages/AuthPage.tsx
- src/pages/AdminPage.tsx
- src/pages/UserProfilePage.tsx
- src/components/organisms/DashboardSidebar.tsx
- src/components/organisms/DashboardNavbar.tsx
- src/components/organisms/ToastContainer.tsx
- src/pages/KnowledgeHomePage.tsx
- src/pages/KnowledgeArticlePage.tsx
- src/pages/KnowledgeAdminPage.tsx

## 19. Estado final
La aplicación interna quedó con:
1. Flujos autenticados sólidos.
2. Manejo robusto de sesión expirada.
3. Dashboard con navegación ordenada y submenús controlados.
4. Perfil completo para usuario y administrador.
5. Integración de conocimiento y administración de permisos.
6. Mejoras visuales y de interacción en sidebar/navbar.
