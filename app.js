var express = require('express');
var bodyParser = require('body-parser');
var Game = require('./Game');

var Promise = require("bluebird")

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// game instance
var game = new Game();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.get('/', function(req, res){
    res.redirect('/create-match');
});

// new game
app.get('/create-match', function(req, res){
    res.render('create-match');
});

app.post('/create-match', function(req, res){
    game.setPlayers(req.body.player1, req.body.player2);
    console.log('Leader: ' + game.leader.name);
    console.log('Follower: ' + game.follower.name);
    res.redirect('/match');
});

// match
app.get('/match', function(req, res){
    res.render('match', {leader: game.leader});
});

app.get('/end', function(req, res){
    res.render('end', {
        player1: game.follower,
        player2: game.leader
    });
});

app.get('/controls/bottom', function(req, res){
    res.render('controlsBottom');
});

app.get('/controls/top', function(req, res){
    res.render('controlsTop');
});

app.get('/controls/main', function(req, res){
    res.render('controlsMain');
});

// socket io
/*
* start_game
* ready_time
* game_time
* switch_players
* ready_time
* game_time
*
* */
io.on('connection', function(socket){

    var countdownHandler = function(time){
        socket.emit('ready_time', time);
    }

    var gameTickHandler = function(time){
        socket.emit('game_time', time);
    }

    var startGameHandler = function(){
        return new Promise(function(resolve, reject){
            game.isReady = true;
            var duration = game.time;
            everySecond(duration, gameTickHandler).then(resolve)
        })
    }

    var switchCountdownHandler = function(time){
        socket.emit('ready_time', time);
    }

    var switchHandler = function(){
        return new Promise(function(resolve, reject){
            game.culcLeaderPoints();
            game.culcFollowerPoints();
            game.switchPlayers();
            game.reset();
            game.isReady = false;

            socket.emit('switch_players', game.leader);

            everySecond(5, switchCountdownHandler).then(resolve)
        })
    }

    var gameEndHanlder = function(){
        console.log('end');
        game.isReady = false;
        game.culcLeaderPoints();
        game.culcFollowerPoints();
        console.log(game.leader);
        console.log(game.follower);
        socket.emit('match_end', {p1: game.follower, p2: game.leader});
    }

    var startCountdown = function(){
        return everySecond(5, countdownHandler)
    }

    socket.on('leader_diffuser_bust', function(){
        if (game.isReady) {
            game.leaderDiffuserBust++;
            console.log('leader_diffuser_bust');
        }
    });

    socket.on('follower_diffuser_bust', function(){
        if (game.isReady) {
            game.followerDiffuserBust++;
            console.log('follower_diffuser_bust');
        }
    });

    socket.on('follower_trick_bust', function(){
        if (game.isReady) {
            game.followerTrickBust++;
            console.log('follower_trick_bust');
        }
    });

    socket.on('follower_bottom_line_bust', function(){
        if (game.isReady) {
            game.followerBottomLineBust++;
            console.log('follower_bottom_line_bust');
        }
    });

    socket.on('leader_penalty', function(){
        if (game.isReady) {
            game.leaderPenalty++;
            console.log('leader_penalty');
        }
    });

    socket.on('follower_penalty', function(){
        if (game.isReady) {
            game.followerPenalty++;
            console.log('follower_penalty');
        }
    });

    socket.on('start_game', function(){
        console.log('start');

        startCountdown()
            .then(startGameHandler)
            .then(switchHandler)
            .then(startGameHandler)
            .then(gameEndHanlder);
    });
});

function everySecond(n, fn){
    return nTimes(n, 1000, fn)
}

function nTimes(n, delay, fn){
    return new Promise(function(resolve, reject){
        function callFn() {
            if (n-1 < 0) {
                resolve();
            } else {
                fn(n);
                n = n-1;
                setTimeout(callFn, delay);
            }
        }
        callFn()
    })
}

server.listen(8000, function(){
    console.log('App is listening on port 8000');
});
