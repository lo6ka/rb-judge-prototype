var socket = io();

var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]); // passes back stuff we need
    }
};

var buttonHandler = function(){
    var action = this.getAttribute('data-action');
    console.log(action);
    socket.emit(action);
};

var buttons = document.querySelectorAll('button.controls');

forEach(buttons, function(index, el){
    el.addEventListener('click', buttonHandler);
});

var app = document.querySelector('[data-id="app"]');
var countdown = document.querySelector('[data-id="countdown"]');
var leader = document.querySelector('[data-id="leader"]');
var startButton = document.querySelector('[data-id="startCountdown"');
var winner = document.querySelector('[data-id="winner"');

var confirmOnPageExit = function () {
    return 'game is still running, are you sure you want to leave?';
};

startButton && startButton.addEventListener('click', function(){
    window.onbeforeunload = confirmOnPageExit;
    socket.emit('start_game');
    this.classList.add('hidden');
});

socket.on('ready_time', function(t){
    app.classList.remove('background--blink');
    app.classList.remove('green');
    app.classList.add('blue');
    countdown.innerHTML = t;
});

socket.on('game_time', function(t){
    app.classList.remove('blue');
    app.classList.add('green');
    countdown.innerHTML = t;
    if (t <=5 ) {
        app.classList.add('background--blink');
    }
});

socket.on('switch_players', function(l){
    leader.innerHTML = l.name;
});

socket.on('match_end', function(){
    window.onbeforeunload = undefined;
    app.classList.remove('background--blink');
    window.location.pathname = '/end'
});


