/**
 * Socket for Chat
 * This file is a Front End script.
 * 
 * Client events are managed here!!!
 */

var socket = io();

// params from url
var params = new URLSearchParams( window.location.search );

// Check for user name
if ( !params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new  Error('Campos incompletos');
}

// Data of user
var user = {
    name: params.get('name'),
    room: params.get('room')
};


/**
 * When a user connects.
 */
socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('connectChat', user, function(resp) {
        console.log('users', resp);
    } );
});

/**
 * When a user disconnects
 */
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


/**
 * When a User connects or Disconnects from the chat
 * receive an updated list of people online
 */
socket.on('ListPeople', function(data) {
    console.log(data);
});


// // Enviar información
// socket.emit('createMessage', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
//});



/**
 * Receive any message from server
 */
socket.on('createMessage', function(mensaje) {
    console.log('Servidor:', mensaje);
});

/**
 * Private Message
 */
socket.on('privateMessage', function(msg) {
    console.log('privateMessage', msg);
});