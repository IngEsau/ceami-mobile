# Arquitectura

La app se organiza por dominio: `auth`, `applications`, `documents`, `signature`, `profile` y `settings`. Las pantallas consumen hooks/casos de uso y store; la persistencia está detrás de `ApplicationRepository`. Documentos y firma declaran puertos de captura y los adapters Expo/mock quedan en `infrastructure`, de modo que cámara, canvas o KYC remoto se sustituyen sin cambiar pantallas. La UI compartida vive en `shared/ui` y el dominio no depende de React Native.
