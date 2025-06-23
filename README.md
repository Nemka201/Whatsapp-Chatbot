# WhatsApp Chatbot

Chatbot de WhatsApp desarrollado con Node.js, Express, React, MongoDB y Docker. Este proyecto actúa como primer filtro de atención al cliente, derivando conversaciones al área correspondiente. Está basado en `whatsapp-web.js`, con posibilidad futura de integrar la API oficial de WhatsApp Business.

---

## 🌟 Características

* Conexión con WhatsApp Web mediante `whatsapp-web.js`
* Persistencia de sesión para evitar reconexiones constantes
* Interfaz web con React (opcional)
* Backend en Express.js con arquitectura MVC
* Almacenamiento de datos en MongoDB
* Contenedores Docker para desarrollo y despliegue

---

## 📊 Tecnologías Utilizadas

* **Node.js** (backend)
* **Express.js** (API)
* **React.js** (frontend)
* **MongoDB** (base de datos)
* **Docker / Docker Compose**
* **whatsapp-web.js** (conexión a WhatsApp)

---

## ⚙️ Requisitos Previos

* Docker y Docker Compose instalados
* Node.js v16+ (si se ejecuta localmente sin Docker)
* WhatsApp en tu teléfono con sesión activa

---

## 🚀 Instalación Local

```bash
git clone https://github.com/Nemka201/Whatsapp-Chatbot.git
cd Whatsapp-Chatbot
```

### Backend:

```bash
cd server
npm install
```

### Frontend:

```bash
cd ../client
npm install
npm run build
```

### Base de datos (MongoDB):

Asegurate de tener Mongo corriendo localmente o usar un proveedor externo.

### Ejecutar:

```bash
cd ../server
npm start
```

---

## 🚫 Autenticación WhatsApp

Al ejecutar por primera vez, el bot mostrará un código QR en la consola. Escanealo con tu aplicación de WhatsApp desde "Dispositivos Vinculados".

> La sesión se guardará en la carpeta `whatsapp-session/` para evitar reconexiones.

---

## 🚧 Despliegue con Docker

### 1. Crear carpetas necesarias:

```bash
mkdir -p data/db whatsapp-session/session
```

### 2. Ejecutar con Docker Compose:

```bash
docker-compose up -d --build
```

### 3. Acceder a la aplicación:

* Frontend: [http://localhost](http://localhost)
* Backend API: disponible según configuración interna

### 4. Ver QR de WhatsApp:

```bash
docker-compose logs -f server
```

---

## 🔄 Estructura del Proyecto

```
Whatsapp-Chatbot/
├── client/               # React frontend
├── server/               # Node.js backend con whatsapp-web.js
├── whatsapp-session/     # Sesión de WhatsApp persistente
├── data/db/              # Datos de Mongo persistentes
├── docker-compose.yml    # Orquestación de servicios
└── nginx.conf            # Config de Nginx (frontend + proxy API)
```

---

## 🚡 Posibles Mejoras Futuras

* Integración completa con la API de WhatsApp Business (Meta)
* Panel administrativo para agentes humanos
* Automatización de tareas (respuestas programadas, integraciones externas)
* Integración con servicios de pagos, envíos u otros CRM

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más información.

---

## 🛠️ Autor

Proyecto desarrollado por [Nemka201](https://github.com/Nemka201).
