const express = require('express');
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')

let puerto = process.env.PORT || 8080

app.use(express.static('views'));
app.use(bodyParser.json())
server.listen(puerto, () => console.log('Servidor iniciado en '+ puerto));

app.use(bodyParser.urlencoded(
  {
      extended:true
  }
))

app.get('/', function (req, res) 
{
    res.sendFile(__dirname + '/views/index.html');
})

app.get('/jugar', function (req, res) 
{
    res.sendFile(__dirname + '/views/juego.html');
})

app.post('/conectarse', function (req, res) 
{
    let nombre = req.body.nombreDeUsuario
    res.send(`<head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Juego</title>
        <link rel="shortcut icon" href="Imagenes/SFrente.png" type="image/x-icon">
        <style>
            html{height: 100vh;}
            body
            {
                height: 100vh; 
                width: 100vw; margin: 0; 
                align-content: center; 
                align-items: center; 
                background-color: white; 
                background-image: url('Imagenes/fondo.png');
                overflow: hidden;
            }
            #lienzo
            {
                height: 95%;
                width: 97%;
                padding: 20px;
                border-radius: 10px;
                padding-top: 0;
                padding-bottom: 0;
            }
            #vida
            {
                background-color: red;
                height: 20px;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <canvas id="vida"></canvas>
        <canvas id="lienzo"></canvas>
        <input type="hidden" name="nombre" id="nombre" value="${nombre}">
  
        <script src="socket.io.js"></script>
        <script src="juego.js"></script>      
    </body>`)
})

app.get('/servidor', function (req, res) 
{
    res.sendFile(__dirname + '/views/servidor.html');
})


io.on('connection', function (socket) 
{
    console.log('socket conectado', socket.id);

    socket.on('disconnect', () =>
    {
        console.log('socket desconectado', socket.id);
    });

    socket.on('juego-terminado', (data) => 
    {console.log("juego terminado")
        io.emit('juego-terminado', data);
    });
});