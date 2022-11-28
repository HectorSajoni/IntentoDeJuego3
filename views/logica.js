
let usuario = document.getElementById('usuario');
let botonEntrar = document.getElementById('entrar');

botonEntrar.addEventListener('click', function (event) 
{
  if(validar(usuario.value))
  {
    if (usuario.value === '') 
    {
      alert('Se requiere un usuario para poder conectarse al juego');
      event.preventDefault()
    }
  }else
  {
    alert("usuario no válido")
    event.preventDefault()
  }
});

function validar(usuario)
{
  user = usuario.value.split('')

  for(var i = 0; i<user.length; i++)
  {
    if(user[i] == '<' || user[i] == '>'){
      return false
    }
  }
  return true
}
