# CEAMI Mobile

MVP mobile en React Native + Expo + TypeScript para demostrar el flujo de otorgamiento de crédito:

`Login → Home → Nueva solicitud → Intro → Documentos → Wizard de 4 pasos → Firma → Solicitud recibida`

## Instalación y ejecución

```bash
npm install
npx expo start
```

Comandos útiles:

```bash
npm run typecheck
npm test
npm run lint
```

## Arquitectura

La app usa una estructura por dominios/features. `src/modules/applications/domain` contiene entidades, schemas y reglas puras; `application` contiene casos de uso y store; `infrastructure` contiene el repositorio local con AsyncStorage; `presentation` contiene las pantallas. Los componentes reutilizables y tokens visuales están en `src/shared`.

La pantalla no accede a AsyncStorage directamente. Para reemplazar el mock por una API REST futura se implementa `ApplicationRepository` con un adapter HTTP y se conservan las entidades y casos de uso.

## Flujo del MVP

- Login validado localmente: correo válido y contraseña mínima de seis caracteres.
- Solicitudes con folio incremental `SOL-000001`.
- Documentos mock usando Expo Image Picker o URI mock cuando no hay permiso.
- Datos generales, familiares, laborales y dos referencias, validados con Zod + React Hook Form.
- Firma mock y confirmación antes de enviar.
- Persistencia local de drafts y solicitudes enviadas.

## Fuera del alcance

No se integra backend, OCR, Buró de crédito, biometría, geolocalización avanzada ni visitas reales. Los placeholders están navegables para que el flujo de demo no tenga botones muertos.

## Especificaciones

Las decisiones funcionales, de arquitectura, diseño, navegación, contratos y pruebas están documentadas en [`specs/`](./specs).
