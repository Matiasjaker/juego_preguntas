# Trivia Master

## 1. Nombre del proyecto

**Trivia Master – Juego de preguntas y respuestas**

Trivia Master es un juego de trivia individual en el que el jugador debe responder preguntas de distintas categorías para conseguir puntos, superar sus propios récords y mejorar su progreso.

## 2. ¿Qué problema resuelve?

Trivia Master busca entregar una forma entretenida e interactiva de aprender y poner a prueba los conocimientos generales.

Muchas veces estudiar o repasar contenidos puede resultar aburrido. Este juego transforma ese proceso en una experiencia más dinámica, donde el usuario puede aprender mientras juega, equivocarse y volver a intentarlo.

## 3. ¿Para quién está dirigido?

Está dirigido principalmente a estudiantes y personas que quieran entretenerse mientras ponen a prueba sus conocimientos.

También está pensado para quienes disfrutan los juegos de preguntas, los desafíos de conocimiento y la posibilidad de superar sus propios resultados.

## 4. Funciones principales

El proyecto cuenta con tres funciones principales:

1. **Sistema de preguntas y respuestas:** permite responder preguntas de selección múltiple organizadas en distintas categorías, como informática, videojuegos, cultura general, ciencia e historia.

2. **Modos de juego:** incluye diferentes desafíos, como el modo clásico, contrarreloj, supervivencia y modo infinito, para ofrecer distintas formas de jugar.

3. **Sistema de progreso:** registra los puntos obtenidos, la experiencia, los niveles y los récords personales del jugador, permitiendo revisar su avance.

## 5. Stack tecnológico

Para desarrollar Trivia Master se utilizaron las siguientes tecnologías:

| Tecnología | Uso dentro del proyecto |
|---|---|
| HTML5 | Crear la estructura de las páginas y los elementos del juego. |
| CSS3 | Diseñar la interfaz, los colores, botones, tarjetas y animaciones. |
| JavaScript | Programar la lógica del juego, las preguntas, los puntajes y los modos de juego. |
| LocalStorage | Guardar el progreso y los récords del jugador en el navegador. |

El proyecto funciona directamente en el navegador, por lo que no necesita una base de datos ni un servidor para jugar.

## 6. ¿Cómo ejecutar el proyecto?

Para ejecutar Trivia Master se deben seguir estos pasos:

1. Descargar o clonar el repositorio del proyecto.
2. Descomprimir la carpeta, si se descargó en formato ZIP.
3. Abrir la carpeta `Trivia_Master`.
4. Buscar el archivo `index.html`.
5. Hacer doble clic sobre el archivo o abrirlo con un navegador como Google Chrome, Microsoft Edge o Firefox.

También se puede abrir el proyecto desde Visual Studio Code utilizando la extensión Live Server.

**Importante:** No es necesario instalar Python, Flask, MySQL ni otras herramientas para ejecutar la versión actual del juego.

## 7. Problemas encontrados y cómo se resolvieron

Durante el desarrollo del proyecto aparecieron algunos problemas que fue necesario solucionar para conseguir que el juego funcionara correctamente.

### Problema 1: Organización del código

Al principio, mantener toda la programación en un solo archivo podía dificultar la lectura y la modificación del proyecto.

**Solución:** Se separó el código en distintos archivos JavaScript, organizando las preguntas, la lógica del juego, el almacenamiento de datos y las funciones principales.

### Problema 2: Guardado del progreso

Era necesario encontrar una forma de conservar los puntos y los récords del jugador aunque cerrara el navegador.

**Solución:** Se utilizó LocalStorage, que permite guardar información directamente en el navegador y recuperarla cuando el jugador vuelve a ingresar.

### Problema 3: Diseño y funcionamiento de la interfaz

Se necesitaba que el juego fuera fácil de utilizar y que los elementos visuales fueran claros y atractivos.

**Solución:** Se trabajó con HTML y CSS para organizar las pantallas, mejorar la distribución de los elementos y aplicar colores, botones y estilos que entregaran una apariencia más cercana a la de un videojuego.

## 8. Objetivo del proyecto

El objetivo de Trivia Master es desarrollar un juego funcional utilizando conocimientos de programación web, aplicando HTML, CSS y JavaScript para crear una experiencia interactiva.

Además, busca demostrar cómo se pueden utilizar estas tecnologías para desarrollar una aplicación sencilla, entretenida y capaz de almacenar información del usuario sin necesitar un servidor externo.

---

**Proyecto:** Trivia Master  
**Tipo:** Juego de preguntas y respuestas individual  
**Tecnologías:** HTML5, CSS3 y JavaScript  
**Almacenamiento:** LocalStorage  
**Ejecución:** Navegador web