// params from url
var params = new URLSearchParams( window.location.search );
var user = params.get('user');
var room = params.get('room');

// Jquery ref
var divUsuarios = $('#divUsuarios');
var formSendMessage = $('#formSendMessage');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');


/**
 * Functions to render users
 * @param people {array objects}
 */
function renderUsers( people ) {
    console.log(people);
    var html = '';

    html+='<li>';
    html+='<a href="javascript:void(0)" class="active"> Chat de <span> '+params.get('room')+'</span></a>';
    html+='</li>';

    for (var i=0; i<people.length; i++) {
        html += '<li>';
        html += '<a data-id="' + people[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + people[i].name + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    html += '<li class="p-20"></li>';
    divUsuarios.html(html);
}


/**
 * Functions to render a message
 * @param message {array}
 */
function renderMessage(message, itsMe) {

    var html = '';
    var date = new Date(message.date);
    var time = date.getHours() + ':' + date.getMinutes();
    var adminClass = 'info';
    if (message.name === 'Admin') {
        adminClass = 'danger';
    }

    if (itsMe) { // render my message
        html += '<li class="reverse animated fadeIn">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + message.name + '</h5>';
        html += '        <div class="box bg-light-inverse">' + message.message + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+time+'</div>';
        html += '</li>';
    } else { // render message for other user
        html += '<li class="animated fadeIn">';
        if ( message.name !== 'Admin') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + message.name + '</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">' + message.message + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+time+'</div>';
        html += '</li>';
    }


    divChatbox.append(html);
}



/**
 * ************************************
 *          Listeners JQuery
 * ************************************
 */


/**
 * Listening to click on any tag <a ... /> inside 
 * the divUsuarios
 * This is dinamic
 */
 divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');    // id on data-id
    if ( id ) {
        console.log(id);
    }

 });

/**
 * Listening event submit on form to send a message * 
 */
 formSendMessage.on('submit',function(e) {
    
    e.preventDefault();    
    if ( txtMessage.val().trim().length === 0) return;

    socket.emit(
        'createMessage', 
        {
            name: user,
            message: txtMessage.val()
        }, 
        function(msg) {
            console.log('server say', msg);
            txtMessage.val('').focus();
            renderMessage(msg, true);
            scrollBottom();
        });
 });



/**
 * Scroll automatic to bottom
 */
function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}