<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="./assets/logo.png" alt="Logo" width="80" height="80">

  <h3 align="center">DePhished</h3>

  <p align="center">
    Una extensión de chrome que detecta si un mail es potencial de phishing.
    <br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de contenidos</summary>
  <ol>
    <li>
      <a href="#about-the-project">Sobre el Proyecto</a>
      <ul>
        <li><a href="#built-with">Hecho con</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Comenzando</a>
      <ul>
        <li><a href="#installation">Instalacion</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Mapa del Proyecto</a></li>
    <li><a href="#acknowledgments">Recursos utilizados</a></li>
  </ol>
</details>



<!-- SOBRE EL PROYECTO -->
## Sobre el Proyecto

Hoy en día existen muchas estafas y robo de datos a través de internet mediante el phishing (páginas web/mails falsos o que incitan a los usuarios a dar datos personales), más específicamente a través de correos electrónicos. Aspiramos a que nuestro servicio ayude a que las personas puedan navegar con seguridad a través de internet y a reducir los ciberataques a través de phishing. 

El proyecto trata de una aplicación y extensión Chrome que, utilizando una base de datos de VirusTotal, se encarga de avisar al usuario si un mail específico es potencial de este ciberataque o no. Esto último realizado a través de alertas en 2 colores diferentes (amarillo y rojo). 

La seguridad es lo más importante a la hora de navegar por internet. Nosotros, a través de DePhished ofrecemos una solución al alcance de todos, gratuita y fácil de entender y utilizar.

<p align="right"><a href="#readme-top">Volver al inicio</a></p>



### Hecho con

Este es el lenguaje utilizado en este proyecto.

<img src=[JS] width="80" height="auto">

<p align="right"><a href="#readme-top">Volver al inicio</a></p>



<!-- COMENZANDO -->
## Comenzando

Estos son los pasos para poder utilizar el proyecto.

### Instalacion

* Clonar el repositorio
  
   ```sh
   git clone https://github.com/martomorri/DePhished.git
   ```
* Abrir la extension en una pestaña de Google Chrome
  
  1. Abrir el menu de opciones en Google.
  2. Abrir la parte de extensiones y clickear en "Gestionar extensiones".
  3. Activar el "Modo desarrollador".
  4. Abrir un explorador de archivos y arrastrar la carpeta.

<p align="right"><a href="#readme-top">Volver al inicio</a></p>


<!-- MAPA DEL PROYECTO -->
## Mapa del Proyecto

- [x] Conexion con la API de Gmail
- [x] Recopilacion de URLs al clickear un mail
- [x] Analisis de URL con la API de VirusTotal
- [x] Analisis de URL con el archivo txt de URLhaus
- [x] Mostrar alertas (harmless, suspicious, malicious)
- [x] Feedback
    - [x] Borrar Mail
    - [x] Ocultar alerta (OK)

<p align="right"><a href="#readme-top">Volver al inicio</a></p>

## Recursos utilizados

Estos son los recursos utilizados en nuestro proyecto:

* [Virus Total](https://developers.virustotal.com/reference/getting-started)
* [URLhaus](https://urlhaus.abuse.ch/)

<p align="right"><a href="#readme-top">Volver al inicio</a></p>



<!-- MARKDOWN LINKS E IMAGENES -->
[JS]: https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/768px-JavaScript-logo.png
