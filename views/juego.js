
var socket = io();

const lienzo = document.querySelector('#lienzo')
lienzo.width = innerWidth
lienzo.height = innerHeight
const screen = lienzo.getContext('2d')

user = document.getElementById('nombre').value

const barraDeVida = document.querySelector('#vida')

const velocidadJugador = 8
const velocidadBala = 12
const velocidadEnemigo = 1.5
const velocidadSangre = 12

//Clases----------------------------------------------------------------------------
class Player
{
    constructor()
    {
        this.position = {x: 0, y: 0}
        this.width = 60
        this.height = 72
        this.ultimaDireccion = 'abajo'
        this.velocidad = {x: 0, y: 0}
        this.vida = 500
        this.image = createImage('Imagenes/SFrente.png')
    }
    draw()
    {
        screen.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update()
    {
        this.position.x += this.velocidad.x
        this.position.y += this.velocidad.y

        if(this.position.x<0) this.position.x = 0
        if(this.position.x>lienzo.width - this.width) this.position.x = lienzo.width - this.width
        if(this.position.y < 0) this.position.y = 0
        if(this.position.y > lienzo.height - this.height) this.position.y = lienzo.height - this.height
        
        this.draw()
    }
    shoot()
    {
        let bullet = new Bullet(this.ultimaDireccion, this.position.x + this.width/3, 
            this.position.y + this.height/3)
        bullets.push(bullet)
    }
}

class Bullet
{
    constructor(direction, px, py)
    {
        this.width = 20
        this.height = 21
        this.position = {x: px, y: py}
        this.direccion = direction
        this.velocidad = {x: 0, y: 0}
        this.image = createImage('Imagenes/poder1.png')
    }
    draw()
    {
        screen.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update()
    {
        if(this.direccion == 'arriba') this.velocidad.y = -velocidadBala
        if(this.direccion == 'abajo') this.velocidad.y = velocidadBala
        if(this.direccion == 'derecha') this.velocidad.x = velocidadBala
        if(this.direccion == 'izquierda') this.velocidad.x = -velocidadBala

        if(this.position.x<0) delete this
        if(this.position.x>lienzo.width - this.width) delete this
        if(this.position.y < 0) delete this
        if(this.position.y > lienzo.height - this.height) delete this

        this.position.x += this.velocidad.x
        this.position.y += this.velocidad.y

        this.draw()
    }
}

class Enemy
{
    constructor()
    {
        this.width = 35
        this.height = 19
        this.position = {x: randint(100, 1200), y: randint(10, 800)}
        this.velocidad = {x: randint(-velocidadEnemigo, velocidadEnemigo), 
            y: randint(-velocidadEnemigo, velocidadEnemigo)}
        this.image = createImage('Imagenes/Mosca.png')
    }
    draw()
    {
        screen.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update(contador)
    {
        if(contador == 50)
        {
            this.velocidad = {x: randint(-velocidadEnemigo, velocidadEnemigo), 
                y: randint(-velocidadEnemigo, velocidadEnemigo)}
        }
        

        this.position.x += this.velocidad.x
        this.position.y += this.velocidad.y

        if(this.position.x < 30) this.position.x = 30
        if(this.position.x > lienzo.width - this.width -30) this.position.x = lienzo.width - this.width -30
        if(this.position.y < 30) this.position.y = 30
        if(this.position.y > lienzo.height - this.height -30) this.position.y = lienzo.height - this.height -30

        this.draw()
    }
    estallar()
    {
        let rapidez = {x: randint(-velocidadSangre, velocidadSangre), 
            y: randint(-velocidadSangre, velocidadSangre)}
        if(rapidez.x==0 && rapidez.y==0) rapidez = {x: randint(-velocidadSangre, velocidadSangre), 
            y: randint(-velocidadSangre, velocidadSangre)}
        let sangre = new Sangre(this.position, rapidez)
        sangres.push(sangre)
    }
}

class Sangre
{
    constructor(position, velocidad)
    {
        this.width = 22
        this.height = 22
        this.position = position
        this.velocidad = velocidad
        this.image = createImage('Imagenes/FuegoRojo.png')
    }
    draw()
    {
        screen.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update()
    {
        if(this.position.x<0) delete this
        if(this.position.x>lienzo.width - this.width) delete this
        if(this.position.y < 0) delete this
        if(this.position.y > lienzo.height - this.height) delete this
        
        this.position.x += this.velocidad.x
        this.position.y += this.velocidad.y

        this.draw()
    }
}

//eventos----------------------------------------------------------------------------
addEventListener('keydown', ({keyCode})=>
{
    switch(keyCode)
    {
        case 38:
            player.velocidad.y = -velocidadJugador
            player.image = createImage('Imagenes/SDetras.png')
            player.ultimaDireccion = 'arriba'
            break
        case 40:
            player.velocidad.y = velocidadJugador
            player.image = createImage('Imagenes/SFrente.png')
            player.ultimaDireccion = 'abajo'
            break
        case 37:
            player.velocidad.x = -velocidadJugador
            player.image = createImage('Imagenes/SIzquierda.png')
            player.ultimaDireccion = 'izquierda'
            break
        case 39:
            player.velocidad.x = velocidadJugador
            player.image = createImage('Imagenes/SDerecha.png')
            player.ultimaDireccion = 'derecha'
            break
        
        case 32:
            if(botonSoltado) player.shoot()
            botonSoltado = false
            break
    }
})

addEventListener('keyup', ({keyCode})=>
{
    switch(keyCode)
    {
        case 39:
            player.velocidad.x = 0
            break
        case 37:
            player.velocidad.x = 0
            break
        case 38:
            player.velocidad.y = 0
            break
        case 40:
            player.velocidad.y = 0
            break
        case 32:
            botonSoltado = true
            break
    }
})

//funciones auxiliares------------------------------------------------------------------
function createImage(url)
{
    const img = new Image()
    img.src = url
    return img
}

function randint(min, max) 
{
    min = Math.ceil(min)
    max = Math.floor(max)
    valor = Math.floor(Math.random() * (max - min + 1) + min)
    return valor
}

function collideAny(personaje, array)
{
    array.forEach((element)=>
    {
        if(element.position.x + element.width >= personaje.position.x && element.position.x < personaje.position.x + personaje.width)
        {
            if(element.position.y + element.height >= personaje.position.y && element.position.y < personaje.position.y + personaje.height)
            {console.log("chocó en las dos columnas")
                return true
            }
        }
    })
    return false
}

//juego--------------------------------------------------------------------------
function jugar()
{
    animacion = requestAnimationFrame(jugar)
    if(player.vida <= 0 || enemigos.length == 0) detener()
    
    screen.clearRect(0, 0, lienzo.width, lienzo.height)
    
    player.update()
    bullets.forEach(bala =>
        {
            bala.update()
        })

    sangres.forEach(sangre =>
        {
            sangre.update()
        })
    
    vid = player.vida/5
    bar = vid.toString() + '%'
    barraDeVida.style.width = bar
    
    contador += 1
    if(contador == 51) contador = 0

    for(let i = 0; i < enemigos.length; i++)
    {
        enemigos[i].update(contador)

        for(let j = 0; j < bullets.length; j++)
        {
            if(bullets[j].position.x + bullets[j].width >= enemigos[i].position.x && bullets[j].position.x < enemigos[i].position.x + enemigos[i].width)
            {
                if(bullets[j].position.y + bullets[j].height >= enemigos[i].position.y && bullets[j].position.y < enemigos[i].position.y + enemigos[i].height)
                {   
                    for(let k = 0; k < cantidadSangres; k++)
                    {
                        enemigos[i].estallar()
                    }

                    //matar enemigo
                    delete enemigos[i]
                    enemigos.splice(i, 1)

                    //destruir bala
                    delete bullets[j]
                    bullets.splice(j, 1)
                }
            }
        }

        if(player.position.x + player.width >= enemigos[i].position.x && player.position.x < enemigos[i].position.x + enemigos[i].width)
        {
            if(player.position.y + player.height >= enemigos[i].position.y && player.position.y < enemigos[i].position.y + enemigos[i].height)
            {
                //bajar vida
                player.vida -= 1
            }
        }        
    }
}

function detener()
{
    cancelAnimationFrame(animacion)
    alert("tiempo de "+segundos+" segundos")
    if(user != '')
    {
        let enemys = (cantidadEnemigos - enemigos.length) + " de " + cantidadEnemigos
        data = {usuario: user, segundos: segundos, enemigos: enemys}
        socket.emit('juego-terminado', data);
    }
    
    location.replace('/')
}


const player = new Player()
player.draw()

cantidadEnemigos = 80
cantidadSangres = 2

let enemigos = []
let bullets = []
let sangres = []
for(let i = 0; i < cantidadEnemigos; i++) enemigos.push(new Enemy())

let colision = false
let contador = 0
let sonidoFuegoReproduciendo = false
let partidaGanada = false
let botonSoltado = true
let segundos = 0

jugar()

setInterval(()=>segundos+=1, 1000)