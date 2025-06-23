Guía de Despliegue con Docker para WhatsApp-Chatbot
A continuación se describen los pasos detallados para desplegar el proyecto WhatsApp-Chatbot utilizando Docker. Este proyecto está compuesto por un backend en Node/Express, una aplicación frontend en React, una base de datos MongoDB y utiliza la biblioteca whatsapp-web.js para interactuar con WhatsApp. El repositorio ya incluye un archivo Docker Compose y una configuración de Nginx para orquestar estos servicios en contenedores
github.com
. Sigue estos pasos para poner en marcha el chatbot en un entorno Docker.
Requisitos Previos
Docker instalado en el sistema (versiones recientes de Docker Engine).
Docker Compose instalado. Nota: Las versiones modernas de Docker ya incluyen Docker Compose integrado como docker compose. En caso contrario, instalar Docker Compose por separado.
Asegúrate de que Docker esté funcionando correctamente (por ejemplo, ejecutando docker --version en la terminal).
Preparación del Proyecto
Clonar el repositorio: Si no lo has hecho aún, clona el repositorio en tu máquina local:
git clone https://github.com/Nemka201/Whatsapp-Chatbot.git
Luego entra en el directorio del proyecto:
cd Whatsapp-Chatbot
Estructura del proyecto: Familiarízate con la estructura de carpetas. Las principales son:
server/ – Contiene el código del backend Node/Express (el chatbot y la API).
client/ – Contiene la aplicación frontend React (posiblemente una interfaz web para el bot o panel de control).
data/db/ – Carpeta vacía destinada a persistir los datos de MongoDB (se montará como volumen del contenedor de Mongo).
whatsapp-session/session/ – Carpeta para persistir la sesión de WhatsApp (se usará para guardar la autenticación del whatsapp-web.js).
Archivos de configuración como docker-compose.yml y nginx.conf en la raíz del repositorio.
Configuración de variables de entorno: El proyecto puede requerir algunas variables de entorno para funcionar correctamente (por ejemplo, cadena de conexión a MongoDB, credenciales de API de WhatsApp Business si se usa, etc.). Revisa la documentación del proyecto o archivos de configuración para identificar estas variables. En particular, asegúrate de tener configurado:
URL de la base de datos MongoDB: En un entorno Docker Compose, normalmente el backend se conectará a MongoDB a través del nombre del servicio. Por ejemplo, una URL típica podría ser mongodb://mongo:27017/nombre_basedatos. Si el código del backend espera una variable de entorno (ej. MONGO_URI), defínela apropiadamente en el entorno Docker.
Credenciales de WhatsApp Business API (si aplica): Si planeas usar la API oficial de WhatsApp Business en lugar de whatsapp-web.js, necesitarás proporcionar los tokens o credenciales correspondientes. (Para la configuración inicial del bot como filtro de atención al cliente usando whatsapp-web.js, probablemente no se necesite esto).
Otras variables: Si el código utiliza un archivo .env local para configuración (por ejemplo, claves de API, puertos, etc.), crea un archivo .env en el directorio server/ o en la raíz según corresponda, y define ahí las variables. Estas variables pueden inyectarse a los contenedores mediante el Docker Compose.
Nota: Si no estás seguro de la versión exacta de Node.js usada en el proyecto, no te preocupes. Usaremos una imagen Docker de Node estable (por ejemplo, Node 18 LTS) que es compatible con versiones recientes de Node. Asegúrate de que en los Dockerfiles se use una versión adecuada (p. ej. FROM node:18-alpine o similar) que soporte la sintaxis y dependencias del proyecto.
Construcción de las imágenes Docker
El repositorio está preparado para Docker, por lo que es probable que existan Dockerfiles y un archivo Compose ya configurados. Docker Compose facilitará la creación de todas las imágenes y la ejecución de los contenedores con un solo comando. Antes de levantar todo, es útil construir las imágenes para asegurarnos de que todo compila correctamente:
Compilar la imagen del backend (Node/Express): El Dockerfile del servidor Node seguramente instalará las dependencias del backend y definirá cómo arrancar la aplicación (por ejemplo, ejecutando npm install y luego npm start en la carpeta server/). Esta imagen incluirá el código del bot y la lógica de conexión a WhatsApp. Si el Dockerfile no especifica la versión de Node, utiliza una imagen base oficial de Node (se recomienda una versión LTS actual, como Node 18). Por ejemplo, en el Dockerfile podrías ver una línea como:
FROM node:18-alpine
Esto indicaría que se usa Node 18 en un entorno Alpine Linux liviano como base de la imagen.
Compilar la imagen del frontend (React): La aplicación React generalmente necesita ser compilada (build) para producción. Esto suele hacerse en una etapa de build que genera archivos estáticos (HTML, CSS, JS minificados). El despliegue Docker puede manejar esto de dos formas:
Multi-stage build: Un Dockerfile para el frontend podría usar Node para compilar la app y luego Nginx para servir los archivos estáticos. Por ejemplo, primero node:18 para correr npm run build en /client, y luego copiar el resultado a una imagen nginx:alpine que sirva el contenido. El archivo nginx.conf en el repositorio sugiere que se usa Nginx para distribuir la aplicación React
github.com
.
Servicio separado: Alternativamente, el docker-compose.yml puede definir un servicio que construya la aplicación React (usando la carpeta client/) y otro servicio Nginx que tome los archivos construidos. Verifica el Docker Compose para entender la estrategia usada.
En cualquier caso, para nuestros propósitos, Docker Compose se encargará de la compilación. No es necesario ejecutar manualmente npm run build fuera de Docker; el proceso de construir la imagen lo hará por ti.
Imagen de Nginx (proxy/static server): El proyecto incluye un nginx.conf personalizado. Esta configuración probablemente:
Sirve los archivos estáticos del frontend React (la carpeta build generada) desde el contenedor Nginx.
Actúa como proxy inverso para las llamadas a la API (redirigiendo las solicitudes a, por ejemplo, /api/ hacia el contenedor del backend Node en su puerto interno).
El Docker Compose probablemente construye una imagen de Nginx que copia el nginx.conf y los archivos estáticos compilados. Esto dará como resultado un contenedor Nginx escuchando en un puerto (usualmente el 80 para HTTP) dentro de Docker
github.com
. Más adelante, veremos cómo se publica ese puerto al host.
Imagen de la base de datos (MongoDB): En la mayoría de casos no es necesario construir una imagen para MongoDB, ya que usaremos la oficial. El servicio de Mongo se definirá en docker-compose.yml usando la imagen oficial de Mongo (por ejemplo, mongo:6 o la versión actual) con las configuraciones necesarias. El volumen ./data/db:/data/db montado garantizará que los datos persistentes se guarden en la carpeta data/db de tu host.
Compilación con Docker Compose: Una vez revisados los puntos anteriores, puedes compilar todas las imágenes ejecutando en la raíz del proyecto:
docker-compose build
Este comando leerá el docker-compose.yml y los Dockerfile correspondientes para construir las imágenes (backend, frontend, etc.). Si prefieres combinar pasos, en el siguiente apartado usaremos docker-compose up --build que también realiza la construcción automáticamente.
Despliegue de los Servicios con Docker Compose
Con las imágenes listas (o confiando en que Docker Compose las construirá), procedemos a levantar los contenedores:
Iniciar Docker Compose: En la raíz del proyecto (donde está docker-compose.yml), ejecuta:
docker-compose up -d --build
El flag --build asegura que se compile la última versión de las imágenes antes de iniciar (puedes omitirlo si ya ejecutaste docker-compose build antes o no has hecho cambios).
-d ejecuta los contenedores en segundo plano (detached mode), para que el comando no bloquee la terminal.
Servicios levantados: Docker Compose iniciará todos los servicios definidos. Según la configuración esperada, deberían ponerse en marcha:
MongoDB – Un contenedor de base de datos, normalmente accesible internamente como mongo:27017. La primera vez, creará el almacenamiento en la carpeta data/db (montada en /data/db dentro del contenedor).
Backend (Express/Node) – Un contenedor Node que ejecuta el servidor Express del chatbot. Suele depender de que MongoDB esté listo (Compose manejará la dependencia mediante depends_on en el YAML, si está configurado). Este servicio probablemente se llame server o backend en el Compose.
Frontend (React + Nginx) – Un contenedor Nginx que sirve la aplicación React y proxies las solicitudes API. Este contenedor expondrá el puerto HTTP para acceder a la interfaz web del chatbot. Revisa en el docker-compose.yml qué puerto del host está mapeado; comúnmente será el 80 (puerto estándar HTTP) mapeado al 80 del contenedor Nginx, o podría ser un puerto personalizado (ej. 3000 o 8080) según decisión de configuración.
Nota: Si el puerto 80 está en uso en tu máquina o no tienes privilegios, puedes modificar el Compose para usar otro puerto host (p. ej. 8080:80). Por defecto asumiremos 80 para los ejemplos.
Verificar contenedores en ejecución: Usa docker-compose ps para listar los contenedores y asegurarte de que todos están “Up” (ejecutándose). Deberías ver algo como:
NAME                      COMMAND                  STATE           PORTS
whatsappbot-mongo-1       "docker-entrypoint.s…"   Up      27017/tcp
whatsappbot-server-1      "docker-entrypoint.s…"   Up      0.0.0.0:XXXX->(puerto interno) 
whatsappbot-nginx-1       "/docker-entrypoint.…"   Up      0.0.0.0:80->80/tcp
(Los nombres pueden variar, pero lo importante es que el estado sea "Up".)
Logs iniciales: Es muy útil inspeccionar los logs para ver si todo cargó bien, especialmente la primera vez:
Ejecuta docker-compose logs -f server para ver los logs en tiempo real del contenedor del backend (asumiendo que se llama server; ajusta al nombre real si difiere).
De igual forma puedes revisar docker-compose logs -f mongo o ... logs -f nginx para cada servicio. En particular, asegúrate de que MongoDB no reporte errores de permisos y que el backend se haya conectado exitosamente a la base de datos.
Autenticación de WhatsApp (Escaneo de QR)
El bot utiliza la biblioteca whatsapp-web.js, que requiere autenticar un cliente de WhatsApp para poder enviar/recibir mensajes. Esto normalmente se hace escaneando un Código QR proporcionado por WhatsApp Web en la primera ejecución. Ten en cuenta lo siguiente:
Primera vez – escaneo necesario: Al iniciar por primera vez el contenedor del backend, no habrá una sesión guardada, por lo que whatsapp-web.js generará un código QR en la consola para vincular tu teléfono. En los logs del contenedor del servidor Node deberías ver algo indicando que abras WhatsApp en tu teléfono y escanees un QR (posiblemente el propio QR renderizado en texto). Es importante acceder a esos logs para capturar el código. Por ejemplo, la biblioteca indica que sin sesión guardada debes escanear el QR code cada vez que reinicias el cliente
wwebjs.dev
 (lo evitaremos guardando la sesión después del primer uso).
Visualizar el código QR: Para ver el QR, mantén el comando de logs del servidor corriendo (docker-compose logs -f server). Cuando el bot inicie, debería imprimir un patrón ASCII que representa el QR code, o una URL/clave que puedes copiar en algún generador de QR. Muchos desarrolladores integran la librería qrcode-terminal para renderizar el QR en la consola. Maximiza la ventana de la terminal para que el QR ASCII no se corte y utiliza tu aplicación de WhatsApp en el móvil (función "Linked Devices" o "Dispositivos vinculados") para escanear el código en pantalla.
Escanear con WhatsApp: Abre WhatsApp en tu teléfono, ve a Dispositivos vinculados (Linked Devices) y elige Vincular un dispositivo. Escanea el código QR que aparece en los logs de la aplicación. Si todo va bien, la biblioteca whatsapp-web.js establecerá la conexión. En los logs deberías ver un mensaje de éxito (por ejemplo, que la autenticación fue exitosa o que se recuperó la sesión).
Persistencia de la sesión: Una vez escaneado el código por primera vez, la sesión de WhatsApp queda guardada para usos futuros. Este proyecto utiliza un directorio dedicado (whatsapp-session/) para almacenar la información de autenticación de WhatsApp. La estrategia recomendada por whatsapp-web.js es usar LocalAuth para que la sesión persista en el sistema de archivos
wwebjs.dev
wwebjs.dev
. Es probable que el código del bot ya esté usando LocalAuth apuntando a la carpeta whatsapp-session (por ejemplo, dataPath: 'whatsapp-session'). Gracias a esto, los archivos de sesión se guardarán en el volumen montado en whatsapp-session/session y no tendrás que escanear el QR en cada reinicio del contenedor. Importante: No borres esta carpeta ni la voltees a vacía entre despliegues, ya que contiene la información necesaria para mantener la sesión activa. Si la eliminas, la próxima vez tendrás que volver a escanear el código QR
wwebjs.dev
.
Problemas comunes: En entornos Docker sin interfaz gráfica, WhatsApp Web (que internamente usa Chromium vía Puppeteer) puede requerir flags especiales. La documentación de whatsapp-web.js señala que se debe lanzar Puppeteer con --no-sandbox y --disable-setuid-sandbox cuando se corre en contenedores o sistemas sin GUI, especialmente ejecutando como root
wwebjs.dev
. Afortunadamente, muchas imágenes de Node incluyen estas configuraciones o la librería las aplica por defecto. Si notas que el contenedor del bot se cierra inmediatamente o lanza errores relacionados con Chromium, podría ser necesario agregar estas opciones en el código de inicialización del cliente WhatsApp:
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    authStrategy: new LocalAuth({ dataPath: 'whatsapp-session' })
});
(Lo anterior es un ejemplo; verifica la implementación real en el código.) Esto se asegura de que Chrome corra en modo sandbox apropiado dentro del contenedor.
Acceso a la aplicación y pruebas
Una vez que los contenedores están corriendo y la sesión de WhatsApp está autenticada, ya puedes interactuar con el sistema:
Interfaz web (frontend): Abre un navegador web en la URL de tu servidor Docker. Si estás trabajando localmente, probablemente sea http://localhost (asumiendo puerto 80) o http://localhost:8080 si configuraste otro puerto. Deberías ver la interfaz React del chatbot (si existe una interfaz para clientes o administradores). Esta podría mostrar un panel de información o simplemente estar lista para futuras funcionalidades. Si la aplicación React es un frontend de administración, podrías tener opciones allí; de lo contrario, el frontend podría ser mínimo si el bot es solo vía WhatsApp.
Prueba del chatbot en WhatsApp: Ahora viene lo principal: envía un mensaje de WhatsApp desde el número que vinculaste (o desde otro teléfono, al número del bot si es distinto). El bot, funcionando como primer filtro de atención, debería responder automáticamente según la lógica programada (por ejemplo, saludos, menú de opciones, etc.). Observa en la consola del backend (logs) cómo aparecen los eventos de mensajes entrantes y salientes.
Logs en tiempo real: Mantén un ojo en docker-compose logs -f server para ver la actividad del bot en tiempo real. Esto es útil para depurar respuestas del bot y asegurarse de que está derivando conversaciones al área correspondiente tal como se diseñó.
Mantenimiento y Consideraciones Adicionales
Detener los contenedores: Si necesitas detener la aplicación, puedes ejecutar docker-compose down desde la carpeta del proyecto. Esto apagará todos los servicios. Gracias a los volúmenes montados, los datos de MongoDB y la sesión de WhatsApp permanecerán en las carpetas locales (data/db y whatsapp-session/), de modo que un próximo up retomará el estado donde lo dejaste.
Reinicios del bot: Mientras no elimines los volúmenes ni borres manualmente esas carpetas, el bot recordará la sesión de WhatsApp vinculada y no requerirá escanear QR de nuevo en cada despliegue. Esto es esencial para operaciones continuas. La estrategia de autenticación local de whatsapp-web.js justamente está pensada para entornos persistentes
wwebjs.dev
 (como un servidor con almacenamiento o un volumen de Docker).
Actualizaciones del código: Si realizas cambios en el código (ya sea backend o frontend), tendrás que reconstruir las imágenes para que se apliquen dentro de los contenedores. Puedes usar docker-compose up -d --build nuevamente o, para reconstruir un servicio específico, docker-compose build <servicio> seguido de docker-compose up -d <servicio>.
Logs de Nginx y Mongo: En caso de problemas de conexión o servicio, revisa también docker-compose logs nginx y docker-compose logs mongo. Por ejemplo, si la aplicación React no carga, podría ser un problema en Nginx (puerto no expuesto, o error de configuración de proxy). Si el bot no responde, puede ser que no esté guardando/leyendo bien de MongoDB.
Versión de Node.js: Dado que no se recuerda la versión exacta de Node usada en desarrollo, en Docker se optó por una versión LTS estable (Node 16 o Node 18, la más cercana a "última en su momento"). Si notas alguna incompatibilidad (por ejemplo, sintaxis no soportada en versiones más antiguas), puedes ajustar la imagen de Node en los Dockerfile. En general Node 18 cubrirá la mayoría de funcionalidades modernas de JS/TS y es una apuesta segura.
Uso de la API de WhatsApp Business: Actualmente el bot funciona mediante whatsapp-web.js (WhatsApp Web). A futuro, si decides integrar la API oficial de WhatsApp Business, tendrás que manejar de forma diferente las credenciales (generalmente tokens de acceso de Facebook/Meta) y el modo de conexión. Esa integración implicaría ajustar la lógica del bot para usar las APIs REST provistas por WhatsApp/Meta en lugar de un cliente web. Dicho cambio también requeriría exponer públicamente un endpoint para recibir webhooks de mensajes entrantes desde Meta. Por ahora, con la solución basada en WhatsApp Web, no necesitas exponer ningún puerto de API al público (toda la comunicación la inicia el propio bot vía la sesión de WhatsApp Web).
Seguridad: Si despliegas este sistema en producción, ten en cuenta buenas prácticas de seguridad:
Establece variables de entorno para credenciales (no las dejes hardcodeadas en la imagen).
Considera usar una red Docker interna (Compose por defecto ya aísla los contenedores en una red propia). Solo expón al host los puertos necesarios (por ejemplo, el de Nginx para la web). MongoDB y el backend pueden permanecer accesibles solo internamente.
Realiza backups de la carpeta data/db periódicamente, ya que contiene todos los datos de la aplicación (p. ej., historial de conversaciones almacenado, etc.). Igualmente, podrías respaldar whatsapp-session si no quieres perder la sesión del dispositivo WhatsApp en caso de migrar de servidor.
