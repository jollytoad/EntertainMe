var spawn = require("child_process").spawn,
    mime = require("./mime"),
    extend = require("./underscore")._.extend;

function Player(mediaId) {
	if ( mediaId ) {
		this.mediaId = mediaId;
		this.contentType = mime.lookup(mediaId);
		this.playerName = exports.contentTypePlayers[this.contentType] || exports.contentTypePlayers[this.contentType.split('/')[0]] || 'none';
		extend(this, exports.players[this.playerName]);
	}
}
Player.prototype.play = function(callback) { callback(this); };
Player.prototype.stop = function(callback) { callback(this); };

exports.Player = Player;

exports.play = function(mediaId, callback) {
	var player = new Player(mediaId);
	player.play(callback || function() {});
	return player;
};

exports.stop = function(player, callback) {
	if ( player && player.stop ) {
		player.stop(callback || function() {});
	}
};

exports.players = {};

exports.players.none = {};

exports.spawnPlayer = {
	play: function(callback) {
        this.childProcess = spawn(this.cmd, this.args.concat(this.mediaId), this.env);
        callback(this);
    },
    stop: function(callback) {
    	if ( this.childProcess && this.childProcess.kill ) {
	    	this.childProcess.kill();
	    }
	    callback(this);
    },
    cmd: '/bin/false',
    args: [],
    env: { 'DISPLAY': ':0.0' }
};

exports.players.vlc = extend({}, exports.spawnPlayer, {
    cmd: '/usr/bin/vlc',
    args: ['--fullscreen', '--play-and-exit']
});

exports.contentTypePlayers = {
    "video": "vlc"
};

