# Arquitectura

La app se organiza por dominio: `auth`, `applications`, `documents`, `signature`, `profile` y `settings`. Las pantallas consumen casos de uso y store; la persistencia está detrás de `ApplicationRepository`. La UI compartida vive en `shared/ui` y el dominio no depende de React Native.
