function Game(){
    // leader
    this.leaderDiffuserBust = 0;
    this.leaderPenalty = 0;

    // follower
    this.followerTopLineBust = 0;
    this.followerDiffuserBust = 0;
    this.followerPenalty = 0;
    this.followerTrickBust = 0;
    this.followerBottomLineBust = 0;

    // players
    this.leader = null;
    this.follower = null;
    this.time = 20;

    this.isReady = false;
    //this.controls = 0;
}

Game.prototype.setPlayers = function(leaderName, followerName){
    this.leader = new Player(leaderName);
    this.follower = new Player(followerName);
};

Game.prototype.culcFollowerPoints = function(){
    this.follower.busts += this.followerBottomLineBust +
        this.followerTopLineBust + this.followerDiffuserBust +
        this.followerTrickBust + this.followerPenalty;
};

Game.prototype.culcLeaderPoints = function(){
    this.leader.busts += this.leaderDiffuserBust + this.leaderPenalty;
};

Game.prototype.switchPlayers = function(){
    var temp = this.leader;
    this.leader = this.follower;
    this.follower = temp;
    console.log(this.leader.name);
    console.log(this.follower.name);
};

/*Game.prototype.checkIfReady = function(){
    if (this.controls >= 3) return true;
};*/

Game.prototype.reset = function(){
    // leader
    this.leaderDiffuserBust = 0;
    this.leaderPenalty = 0;

    // follower
    this.followerTopLineBust = 0;
    this.followerDiffuserBust = 0;
    this.followerPenalty = 0;
    this.followerTrickBust = 0;
    this.followerBottomLineBust = 0;
};

function Player(name){
    this.name = name;
    this.busts = 0;
}

module.exports = Game;
