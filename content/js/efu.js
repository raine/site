function onImageLoad() {
	var pickRandom = function() {
		return _.first(_.shuffle(_.flatten(arguments)));
	};

	var makeRandomEffect = function(opts) {
		opts = opts || {};

		var effects = [
			function() {
				// var banned     = [ 'easeInOutElastic' ];
				// var easings    = _.without(_.keys(Easing), banned);
				// var easingName = pickRandom(_.keys(Easing));
				// console.log(easingName);
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
					// console.log(easingName);
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
					easing     : Easing['easeInBounce'],
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

	var effectLoop = function() {
		(function doEffect() {
			var effect = makeRandomEffect();
			var cb = function() {
				setTimeout(function() {
					var efu = makeRandomEffect({
						reverse   : true,
						blockSize : effect.opts.blockSize
					});

					restore();
					efu.fn(canvas, function() {
						setTimeout(doEffect, _.random(4000, 7000));
					});
				}, _.random(2500, 5000));
			};

			effect.fn(canvas, cb);
		})();
	};

	setTimeout(effectLoop, 5000);
}

// Ensures that load is fired on the image only once
var domReady = function() {
	$('#avatar').one('load', onImageLoad).each(function() {
		if (this.complete) $(this).load();
	});
};

$(domReady);
