var spawn = require("child_process").spawn,
    mime = require("./mime"),
    extend = require("./underscore").extend,
    player = exports,
    playing;

player.play = function(name) {
    playing = player.get(name).play(name);
    return playing;
};

player.stop = function() {
    playing.kill();
    playing = player.none;
}

player.get = function(name) {
    var mimetype = mime.lookup(name),
        handlerName = player.MIME[mimetype] || player.MIME[mimetype.split('/')[0]];
    return handlerName && player[handlerName] || player.none;
};

player.none = {
    play: function() { return { kill: function() {} }; }
};
playing = player.none;

player.Spawn = {
    play: function(filename) {
        return spawn(this.cmd, this.args.concat(filename), this.env );
    },
    cmd: '/bin/false',
    args: [],
    env: { 'DISPLAY': ':0.0' }
};

player.vlc = extend({}, player.spawn, {
    cmd: '/usr/bin/vlc',
    args: ['--fullscreen', '--play-and-exit']
}, player.spawn);

player.MIME = {
    "video": "vlc"
};

