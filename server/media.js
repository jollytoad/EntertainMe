var spawn = require("child_process").spawn,
    mime = require("mime"),
    extend = require("underscore")._.extend,
    ws = require("websocket"),
    player;

function Player(mediaId) {
	if ( mediaId ) {
		this.mediaId = mediaId;
		this.contentType = mime.type(mediaId);
		this.title = mime.title(mediaId);

		this.playerName = exports.contentTypePlayers[this.contentType]
					   || exports.contentTypePlayers[this.contentType.split('/')[0]]
					   || 'none';

		extend(this, exports.players[this.playerName]);
	}
}

Player.prototype.play = function(callback) { callback(this); };
Player.prototype.stop = function(callback) { callback(this); };
Player.prototype.toJSON = function() {
	return {
		title: this.title,
		mime: this.contentType,
		mediaId: this.mediaId,
		playerName: this.playerName
	};
};


exports.Player = Player;

exports.play = function(mediaId, callback, endCallback) {
	player = new Player(mediaId);
	player.play(function() {
		if ( callback ) {
			callback.apply(this, arguments);
		}
//		ws.broadcast({ event: "playing", args: [ { title: player.title } ] });
		ws.broadcast({ event: "playing", args: [ player ] });
	}, function() {
		if ( endCallback ) {
			endCallback.apply(this, arguments);
		}
		ws.broadcast({ event: "stopped" });
	});
	return player;
};

exports.stop = function(callback) {
	if ( player && player.stop ) {
		player.stop(callback || function() {});
	}
};

exports.players = {};

exports.players.none = {};

exports.spawnPlayer = {
	play: function(callback, endCallback) {
		var player = this;
        this.childProcess = spawn(this.cmd, this.args.concat(this.mediaId), this.env);
        this.childProcess.addListener('exit', function() { endCallback(player); });
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

