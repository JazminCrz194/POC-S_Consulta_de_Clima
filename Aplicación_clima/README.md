# Climora · Aplicación del clima (PWA)

**Climora** es un prototipo funcional (POC) de una aplicación web progresiva (*Progressive Web App* o PWA) que permite consultar información meteorológica de diferentes ciudades de forma personalizada.

El proyecto demuestra la integración de **React**, la API de **OpenWeatherMap** y **LocalStorage** para consultar información del clima y almacenar las preferencias del usuario.

## Funcionalidades

- Búsqueda del clima actual por ciudad: temperatura, descripción, humedad, velocidad del viento y sensación térmica.
- Pronóstico meteorológico para los próximos **5 días**.
- Cambio de unidades de temperatura entre **Celsius (°C)** y **Fahrenheit (°F)**.
- Modo claro y modo oscuro.
- Persistencia de las preferencias del usuario mediante **LocalStorage**.
- Instalación como aplicación (**PWA**) en escritorio y dispositivos móviles compatibles.
- Manejo de errores: ciudad no encontrada, API key inválida o faltante y fallos de conexión.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| **React** | Desarrollo de la interfaz de usuario. |
| **Vite** | Entorno de desarrollo y compilación. |
| **JavaScript** | Lógica y funcionalidad de la aplicación. |
| **CSS** | Diseño y estilos de la interfaz. |
| **vite-plugin-pwa** | Integración de las características PWA, como el manifest y el Service Worker. |
| **OpenWeatherMap API** | Obtención de datos meteorológicos. |
| **LocalStorage** | Almacenamiento de las preferencias del usuario. |

## Requisitos previos

Antes de instalar el proyecto, es necesario contar con:

- [Node.js](https://nodejs.org/) (se recomienda una versión LTS compatible con las dependencias).
- npm.
- Una API key gratuita de [OpenWeatherMap](https://openweathermap.org/api).

> **Nota:** La clave de OpenWeatherMap puede tardar un tiempo en activarse después del registro.

## Instalación

**1. Clonar el repositorio:**

```bash
git clone <url-del-repositorio>
```

**2. Acceder a la carpeta del proyecto:**

```bash
cd <nombre-del-repositorio>
```

**3. Instalar las dependencias:**

```bash
npm install
```

## Configuración de la API key

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_WEATHER_API_KEY=tu_clave_aqui
```

> **Importante:** El archivo `.env` no debe subirse al repositorio. Verificar que esté incluido en `.gitignore`. Si se modifica la variable de entorno, es necesario reiniciar el servidor de desarrollo.

## Ejecución

### Modo desarrollo

Ejecutar el siguiente comando:

```bash
npm run dev
```

Abrir la dirección que muestra la terminal, normalmente:

[http://localhost:5173](http://localhost:5173)

### Compilar y probar como PWA

Para generar la versión de producción y probar las características de la PWA, ejecutar:

```bash
npm run build
npm run preview
```

Abrir la dirección que muestra la terminal, normalmente:

[http://localhost:4173](http://localhost:4173)

## Preferencias guardadas en LocalStorage

La aplicación utiliza `LocalStorage` para conservar las preferencias del usuario entre sesiones.

| Clave | Contenido | Valores |
|---|---|---|
| `climora-city` | Última ciudad consultada. | Texto (ej. Chihuahua). |
| `climora-theme` | Tema de la interfaz. | `light` / `dark`. |
| `climora-unit` | Unidad de temperatura. | `C` / `F`. |

Al abrir la aplicación, las preferencias se restauran y se consulta automáticamente el clima de la última ciudad guardada.
