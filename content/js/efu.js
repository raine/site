(function() {
	var hidden, visibilityChange;
	if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
		hidden = 'hidden';
		visibilityChange = 'visibilitychange';
	} else if (typeof document.mozHidden !== 'undefined') {
		hidden = 'mozHidden';
		visibilityChange = 'mozvisibilitychange';
	} else if (typeof document.msHidden !== 'undefined') {
		hidden = 'msHidden';
		visibilityChange = 'msvisibilitychange';
	} else if (typeof document.webkitHidden !== 'undefined') {
		hidden = 'webkitHidden';
		visibilityChange = 'webkitvisibilitychange';
	}

	function handleVisibilityChange() {
		$(document).trigger('visibility', document[hidden]);
	}

	if (typeof document.addEventListener !== 'undefined' &&
		typeof hidden !== 'undefined') {
		document.addEventListener(visibilityChange, handleVisibilityChange, false);
	}
}());

function onImageLoad() {
	var pickRandom = function() {
		return _.first(_.shuffle(_.flatten(arguments)));
	};

	var makeRandomEffect = function(opts) {
		opts = opts || {};

		var effects = [
			function() {
				opts = _.defaults(opts, {
					blockSize  : 16,
					duration   : pickRandom(1000, 2000, 3000),
					randomize  : true,
					reverseDir : pickRandom(true, false),
					easing     : Easing.easeOutBounce,
					delay      : pickRandom(20, 100)
				});

				return function(canvas, cb) {
					Px.animateTiles(canvas, opts, cb);
				};
			},

			function() {
				opts = _.defaults(opts, {
					blockSize  : 8,
					duration   : 500,
					randomize  : pickRandom(true, false),
					reverseDir : pickRandom(true, false),
					easing     : pickRandom(Easing.easeOutQuad, Easing.easeOutBounce),
					delay      : 5
				});

				return function(canvas, cb) {
					Px.animateTiles(canvas, opts, cb);
				};
			},

			function() {
				var easingName = pickRandom(_.keys(Easing));
				opts = _.defaults(opts, {
					blockSize  : 32,
					duration   : _.random(3000, 5000),
					randomize  : pickRandom(true, false),
					reverseDir : pickRandom(true, false),
					easing     : Easing[easingName],
					delay      : 20
				});

				return function(canvas, cb) {
					Px.animateTiles(canvas, opts, cb);
				};
			}
		];

		var reverseEffects = [
			function() {
				return function(canvas, cb) {
					var easingName = pickRandom('easeInBounce', 'easeOutBounce', 'easeInOutBack');
					Px.animate(canvas, {
						easing   : Easing[easingName],
						duration : 2000,
						start    : opts.blockSize,
						end      : 1
					}, cb);
				};
			},

			function() {
				var easingName = pickRandom(_.keys(Easing));
				var dur;
				if (opts.blockSize === 8) {
					dur = _.random(750, 2000);
				} else if (opts.blockSize === 16) {
					dur = _.random(1000, 2000);
				} else {
					dur = _.random(3000, 5000);
				}

				opts = _.defaults(opts, {
					duration   : dur,
					randomize  : pickRandom(true, false),
					reverseDir : pickRandom(true, false),
					easing     : Easing.easeInBounce,
					delay      : 5
				});

				return function(canvas, cb) {
					Px.animateTiles(canvas, opts, cb);
				};
			},
		];

		var effect;
		if (opts.reverse) {
			effect = pickRandom(reverseEffects)();
		} else {
			effect = pickRandom(effects)();
		}

		return { opts: opts, fn: effect };
	};

	var convertImageToCanvas = function(image) {
		var canvas = document.createElement('canvas');
		canvas.width  = 128;
		canvas.height = 128;
		canvas.getContext('2d').drawImage(image, 0, 0);
		return canvas;
	};

	var canvas   = convertImageToCanvas(this);
	var ctx      = canvas.getContext('2d');
	var imgDcopy = ctx.getImageData(0, 0, canvas.width, canvas.height);

	$(this).parent().append(canvas);

	var restore = function() {
		ctx.putImageData(imgDcopy, 0, 0);
	};

	var START_DELAY   = 5000;
	var REVERSE_DELAY = _.random(2500, 5000);
	var NEXT_DELAY    = _.random(4000, 7000);
	var pageHidden;

	$(document).on('visibility', function(ev, hidden) {
		pageHidden = hidden;
	});

	var effectLoop = function() {
		(function doEffect() {
			var again = function() {
				setTimeout(doEffect, NEXT_DELAY);
			};

			if ($(canvas).is(':hidden') || pageHidden) {
				return again();
			}

			var effect = makeRandomEffect();
			var cb = function() {
				setTimeout(function() {
					var efu = makeRandomEffect({
						reverse   : true,
						blockSize : effect.opts.blockSize
					});

					restore();
					efu.fn(canvas, again);
				}, REVERSE_DELAY);
			};

			effect.fn(canvas, cb);
		})();
	};

	setTimeout(effectLoop, START_DELAY);
}

// Ensures that load is fired on the image only once
var domReady = function() {
	$('#avatar-wrap .pic').one('load', onImageLoad).each(function() {
		if (this.complete) $(this).load();
	});
};

$(domReady);
