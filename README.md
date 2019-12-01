# Landing Entel #

El repositorio Entel Landing contiene el código base para la creación de landings de campaña y la generación del 
código necesario para la publicación en el servidor de producción.

### Requerimientos de desarrollo


Tecnología | Herramientas
------ | -----
**HTML** | Generado con [PUG](https://pugjs.org/)
**CSS** | [SMACSS](https://smacss.com/) para organizar estilos, [SASS](http://sass-lang.com/), [Autoprefixer](https://github.com/postcss/autoprefixer), [CSSNano](https://github.com/ben-eb/cssnano), [Sass Lint](https://github.com/sasstools/gulp-sass-lint)
**Imágenes** | Compresión de imágenes [imagemin](https://www.npmjs.com/package/gulp-imagemin)
**JS** | Minificado con [Uglify](https://github.com/terinjokes/gulp-uglify), [JS Lint](http://www.jslint.com/help.html)
**Servidor** | [BrowserSync](https://www.browsersync.io/) Sincronizar y visualizar cambios en navegadores
**[NPM](https://www.npmjs.com/)** |  para el manejo de paquetes.
**[EditorConfig](http://editorconfig.org/)** | Para configuración del IDE de trabajo.



### Configurar el ambiente de trabajo

Para empezar a trabajar con el proyecto se requiere clonar el proyecto y luego instalar todas las dependencias con: 

```
npm install
```

### Flujo de trabajo Frontend

Para el flujo de trabajo se tienen los siguientes comandos:

```bash
gulp help           # Muestra los comandos disponibles
gulp build          # Compila para el ambiente de desarrollo
gulp release        # Compila para el ambiente de producción
gulp run            # Inicia el servidor web y detecta los cambios
gulp test           # Realiza test de JSLint y SassLint
gulp test:visual    # Realiza test de Regresión Visual
```
Una vez lanzado el servidor web se puede acceder mediante: [http://localhost:3000](http://localhost:3000)

### Estructura de carpetas

Las carpetas tienen la siguiente estructura:

* `source`: contiene el código fuente para trabajar.
* `source/pug` : Contiene el markup del landing en formato `.pug`
* `source/sass` : Contiene estilos en SASS organizado en base a [SMACSS](https://smacss.com/book/categorizing/)
* `build`: contiene los archivos para visualizar el proyecto en desarrollo.
* `release`: contiene los archivos para subir a producción.
* `tests`: contiene las imágenes para pruebas de regresión visual

### Flujo de trabajo  Bitbucket

Para trabajar con el repositorio se requiere primero registrar la tarea como Issue en Bitbucket. Luego seguir las reglas de nomenclatura de ramas y commits.

#### Nomenclatura de ramas

* Debe comenzar con el número de issue formateado a 3 digitos.
* Debe continuar con el nombre del issue formateado en URL.

Ejemplo: `003-landing-cyberday`

#### Nomenclatura de commits

* Debe empezar con un # seguido del número de issue formateado a 3 digitos.
* Se debe separar el número del issue del contenido por un guión.
* Se debe incluir un resumen de los cambios hechos 

Ejemplo: `git commit -m "#003 - Validación del formulario de registro"`

### Pruebas de Regresión Visual

Para ejecutar las pruebas de regresión visual se requiere crear el archivo `baseline_0.png` con el diseño del landing (no incluir header y footer) y guardarlo en la carpeta `tests`. Para las pruebas de regresión visual se requiere ejecutar:

```bash
gulp test:visual
```

Luego de ejecutar las pruebas se generan las imagenes resultantes en la carpeta `tests`.

