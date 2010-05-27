var spawn = require("child_process").spawn,
    mime = require("./mime"),
    extend = require("./underscore")._.extend;

exports.play = function(name) {
	var ret = {};
	ret.mediaName = name;
	ret.contentType = mime.lookup(name);
	ret.playerName = exports.contentTypePlayers[ret.contentType] || exports.contentTypePlayers[ret.contentType.split('/')[0]] || 'none';
	ret.player = exports.players[ret.playerName];
	ret.instance = ret.player.play(name);
	return ret;
};

exports.stop = function(playObj) {
	if ( playObj && playObj.player ) {
		playObj.player.stop(playObj.instance);
	}
}

exports.players = {};

exports.players.none = {
    play: function() {},
    stop: function() {}
};

exports.players.spawn = {
    play: function(filename) {
        return spawn(this.cmd, this.args.concat(filename), this.env );
    },
    stop: function(instance) {
    	if ( instance && instance.kill ) {
	    	instance.kill();
	    }
    },
    cmd: '/bin/false',
    args: [],
    env: { 'DISPLAY': ':0.0' }
};

exports.players.vlc = extend({}, exports.players.spawn, {
    cmd: '/usr/bin/vlc',
    args: ['--fullscreen', '--play-and-exit']
});

exports.contentTypePlayers = {
    "video": "vlc"
};

