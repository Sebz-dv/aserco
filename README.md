# Impulso Financiero — landing page

Landing corporativa estática construida con React, TypeScript, Vite y Tailwind CSS v4. No incluye backend ni persistencia de formularios.

## Requisitos
- Node.js 20.19+ o 22.12+
- npm

## Instalación
```bash
npm install
npm run dev
```

## Producción
```bash
npm run build
npm run preview
```

## Estructura
```text
src/
├── components/
│   ├── atoms/        # Button, Brand, SectionHeading
│   ├── molecules/    # ServiceCard, ProductCard
│   └── organisms/    # Header, Hero, Services, Approach, PersonalProducts, Contact, Footer
├── data/             # Contenido de servicios y productos
├── pages/            # HomePage
├── App.tsx
├── index.css
└── main.tsx
```

## Personalización antes de publicar
1. Cambia el nombre provisional **Impulso Financiero** y el isotipo en `Brand.tsx`.
2. Edita los servicios y los tres productos personales en `src/data/content.ts`.
3. Sustituye correo, teléfono y ciudad en `Contact.tsx`; también actualiza el enlace `mailto:`.
4. Revisa los textos legales y las condiciones reales de los productos con las entidades aliadas.
5. Ajusta los colores globales buscando `emerald` (verde), `blue` (azul) y `#071b2d` (azul oscuro).

El modo oscuro/claro funciona con un control en el header y recuerda la preferencia en el navegador mediante `localStorage`.
