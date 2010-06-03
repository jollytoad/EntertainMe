var net = require("net");
var sys = require("sys");

exports.connect = function(host, port) {
	var stream,
		encoding = "UTF8",
		queue = [];
	
	function next() {
		if ( queue.length ) {
			queue.shift()();
		}
	}
	
	function send(cmd, callback) {
		queue.push(function() {
			var version,
				response = "";

			function write() {
				sys.puts("mpd send: " + cmd);
				stream.write(cmd+"\n", encoding);
			}
			
			if ( stream ) {
				write();
			} else {
				stream = net.createConnection(port || 6600, host);
				stream.setEncoding(encoding);
			
				stream.addListener("data", function(data) {
					var m;
					sys.puts("mpd recv: " + data.replace(/\n/g, "\\n"));

					if ( stream.mpdVersion ) {
						m = /^(OK|ACK)(.*)$/m.exec(data);
						if ( m ) {
							sys.puts("mpd end of response");
							response += data.slice(0, m.index);
							callback(m[1] == "ACK" && m[2].trim, response, stream.mpdVersion);
							next();
						} else {
							sys.puts("mpd awaiting more data");
							response += data;
						}
					} else {
						m = /^OK MPD (.+)$/m.exec(data);
						if ( !m ) {
							throw "Unexpected MPD response: " + data;
						}
						stream.mpdVersion = m[1];
						write();
					}
				});
		
				stream.addListener("close", function(data) {
					stream = undefined;
					next();
				});
			}
			return stream;
		});
		
		if ( queue.length === 1 ) {
			next();
		}
	}
		
	var cmds = {
		send: send
	};
	
	function cmd(name, hasSideEffect, process) {
		cmds[name] = process ?
			function(callback) {
				send(name, function(error, response) {
					callback(error, error ? response : process(response));
				});
			} :
			function(callback) {
				send(name, callback);
			};
		cmds[name].hasSideEffect = hasSideEffect;
	}
	
	function lines(res) {
		return res.trim().split("\n");
	}
	
	function forEachProp(res, fn) {
		lines(res).forEach(function(line) {
			var m = /^(.+): (.+)$/.exec(line);
			if ( m ) {
				fn(m[1], m[2]);
			}
		});
	}

	function isArray(a) {
		return Object.prototype.toString.call(a) === '[object Array]';
	}

	function addProp(current, value) {
		return current === undefined ? value
			 : isArray(current) ? current.concat(value)
			 : [current, value];
	}

	function simpleList(key) {
		return function(res) {
			var list = [];
			forEachProp(res, function(prop, value) {
				if ( prop === key )
					list.push(value);
			});
			return list;
		};
	}
	
	function objectList(key) {
		return function(res) {
			var list = [], entry = {};
			forEachProp(res, function(prop, value) {
				if ( prop === key ) {
					// Start a new entry
					entry = {};
					list.push(entry);
				}
				entry[prop] = addProp(entry[prop], value);
			});
			return list;
		};
	}

	function simpleMap() {
		return function(res) {
			var map = {};
			forEachProp(res, function(prop, value) {
				map[prop] = value;
			});
			return map;
		};	
	}

	function objectMap(key) {
		return function(res) {
			var map = {}, entry = {};
			forEachProp(res, function(prop, value) {
				if ( prop === key ) {
					// Start a new entry
					entry = {};
					map[value] = addProp(map[value], entry);
				} else {
					entry[prop] = addProp(entry[prop], value);
				}
			});
			return map;
		};
	}
	
	// Status
	cmd("clearerror", true);
	cmd("currentsong", false, simpleMap());
	//cmd("idle", false);
	//cmd("noidle", false);
	// NOTE: idle & noidle will require special handling
	cmd("status", false, simpleMap());
	cmd("stats", false, simpleMap());

	// Playback options
	cmd("consume", true); // {STATE:boolean}
	cmd("crossfade", true); // {SECONDS:integer}
	cmd("random", true); // {STATE:boolean}
	cmd("repeat", true); // {STATE:boolean}
	cmd("setvol", true); // {VOL:0-100}
	cmd("single", true); // {STATE:boolean}
	cmd("replay_gain_mode", true); // {MODE:"off/track/album"} - also triggers idle cmd
	cmd("replay_gain_status", false);

	// Controlling playback
	cmd("next", true);
	cmd("pause", true); // {PAUSE:boolean}
	cmd("play", true); // [SONGPOS:integer]
	cmd("playid", true); // [SONGID]
	cmd("seek", true); // {SONGPOS:integer} {TIME:integer seconds}
	cmd("seekid", true); // {SONGID} {TIME}
	cmd("stop", true);

	// The current playlist
	cmd("add", true); // {URI}
	cmd("addid", true); // {URI} [POSITION]
	cmd("clear", true);
	cmd("delete", true); // [{POS} | {START:END}]
	cmd("deleteid", true); // {SONGID}
	cmd("move", true); // [{FROM} | {START:END}] {TO}
	cmd("moveid", true); // {FROM} {TO}
	cmd("playlist", false);
	cmd("playlistfind", false); // {TAG} {NEEDLE}
	cmd("playlistid", false); // {SONGID}
	cmd("playlistinfo", false); // [[SONGPOS] | [START:END]]
	cmd("playlistsearch", false); // {TAG} {NEEDLE}
	cmd("plchanges", false); // {VERSION}
	cmd("plchangesposid", false); // {VERSION}
	cmd("shuffle", true); // [START:END]
	cmd("swap", true); // {SONG1} {SONG2}
	cmd("swapid", true); // {SONG1} {SONG2}

	// Stored playlists
	cmd("listplaylist", false); // {NAME}
	cmd("listplaylistinfo", false); // {NAME}
	cmd("listplaylists", false, objectList('playlist'));
	cmd("load", true); // {NAME}
	cmd("playlistadd", true); // {NAME} {URI}
	cmd("playlistclear", true); // {NAME}
	cmd("playlistdelete", true); // {NAME} {SONGPOS}
	cmd("playlistmove", true); // {NAME} {SONGID} {SONGPOS}
	cmd("rename", true); // {NAME} {NEW_NAME}
	cmd("rm", true); // {NAME}
	cmd("save", true); // {NAME}

	// The music database
	cmd("count", false); // {TAG} {NEEDLE}
	cmd("find", false); // {TYPE} {WHAT}
	cmd("findadd", false); // {TYPE} {WHAT}
	cmd("list", false); // {TYPE} [ARTIST]
	cmd("listall", false); // [URI]
	cmd("listallinfo", false); // [URI]
	cmd("lsinfo", false); // [URI]
	cmd("search", false); // {TYPE} {WHAT}
	cmd("update", true); // [URI]
	cmd("rescan", true); // [URI]

	// Connection settings
	cmd("close", true);
	cmd("kill", null);
	cmd("password", null); // {PASSWORD}
	cmd("ping", false);

	// Audio output devices
	cmd("disableoutput", true);
	cmd("enableoutput", true);
	cmd("outputs", false, objectMap('outputid'));
	
	// Reflection
	cmd("commands", false);
	cmd("notcommands", false);
	cmd("tagtypes", false);
	cmd("urlhandlers", false);
	cmd("decoders", false, objectMap('plugin'));

	return cmds;
};

