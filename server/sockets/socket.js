const { io } = require('../app');
const { Users } = require('../class/users');
const { createMessage } = require('../utils/utils');

const users = new Users();


/**
 * Socket Connections
 */
io.on('connection', (client) => {

    console.log('Usuario conectado');


    /**
     * Client connect to chat
     */
    client.on('connectChat', (data, callback) => {
        
        if ( !data.name || !data.room ) {
            return callback({
                error: true,
                message: 'Name/room is required'
            });
        }

        client.join(data.room);

        users.addPerson(client.id, data.name, data.room );

        client.broadcast.to(data.room).emit('ListPeople', users.getPersonsByRoom(data.room) );

        return callback(users.getPersonsByRoom(data.room));
    });

    /**
     * Client Discconect from chat
     */
    client.on('disconnect', () => {
        console.log('User disconnect',client.id);
        let deletePerson = users.deletePerson(client.id);
        
        client.broadcast.to(deletePerson.room).emit('createMessage', createMessage('Admin',`${deletePerson} got disconnected`))
        client.broadcast.to(deletePerson.room).emit('ListPeople', users.getPersonsByRoom(deletePerson.room) );
    });


    /**
     * When the client sends a message, this message is sent to all people
     */
    client.on('createMessage', (data) => {
        console.log('server - create message', data);

        let person = users.getPersonByID(client.id);
        let msg = createMessage(person.name, data.message);
        
        client.broadcast.to(person.room).emit('createMessage', msg);
    });


    /**
     * Private Message
     * @params {Object} data            -all data for private Message.
     * @params {string} data.toUser:    -socket id to send to
     * @params {string} data.message:   -message body
     */
    client.on('privateMessage', data => {
        console.log(data);
        let person = users.getPersonByID(client.id);

        client.broadcast.to(data.toUser).emit('privateMessage', createMessage(person.name, data.message) );
    });

});