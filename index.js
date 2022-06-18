// Importamos dependencias
const yargs = require("yargs");
const http = require("http");
const fs = require("fs");
const url = require("url");
const jimp = require("jimp");

// 1.- El servidor debe ser levantado por instrucción de una aplicación Node que use el paquete Yargs para capturar los argumentos en la línea de comando. Se deberá ejecutar el comando para levantar el servidor solo si el valor de la propiedad “key” es la correcta (123).

const key = 123;
const argv = yargs
  .command(
    "servidor",
    "Levantar servidor",
    {
      acceso: {
        describe: "Key",
        demand: true,
        alias: "k",
      },
    },
    (args) => {
      args.acceso == key
        ? http
            .createServer((req, res) => {
              // 2. El servidor debe disponibilizar una ruta raíz que devuelva un HTML con el formulario para el ingreso de la URL de la imagen a tratar.
              if (req.url == "/") {
                res.writeHead(200, { "Content-Type": "text/html" });
                fs.readFile("index.html", "utf8", (err, html) => {
                  res.end(html);
                });
              }

              // 3.- Los estilos de este HTML deben ser definidos por un archivo CSS alojado en el servidor.
              if (req.url == "/estilos") {
                res.writeHead(200, { "Content-Type": "text/css" });
                fs.readFile("estilos.css", (err, css) => {
                  res.end(css);
                });
              }
              const params = url.parse(req.url, true).query;
              const url_imagen = params.ruta;

              // 4.- redirigir a otra ruta y procesar la imagen en escala de grises, con calidad a un 60%, y redimensionada a unos 350px de ancho. Posteriormente debe ser guardada con nombre newImg.jpg y devuelta al cliente.
              if (req.url.includes("/imagen")) {
                jimp.read(url_imagen, (err, imagen) => {
                  imagen
                    .resize(350, jimp.AUTO)
                    .grayscale()
                    .quality(60)
                    .writeAsync("newImg.jpg")
                    .then(() => {
                      fs.readFile("newImg.jpg", (err, Imagen) => {
                        res.writeHead(200, { "Content-Type": "image/jpeg" });
                        res.end(Imagen);
                      });
                    });
                });
              }
            })
            .listen(3000, () => console.log("Servidor encendido", process.pid))
        : console.log("Credenciales incorrectas");
    }
  )
  .help().argv;
