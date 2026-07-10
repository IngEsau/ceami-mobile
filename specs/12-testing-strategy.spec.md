# Estrategia de pruebas

Las reglas puras, schemas, casos de uso y puertos de captura tienen pruebas unitarias. Los componentes críticos tienen pruebas de render y acciones; las pantallas de login, documentos, firma y success verifican los estados clave del flujo con React Native Testing Library. El entorno de Jest simula safe areas para ejecutar pantallas sin depender de un dispositivo.
