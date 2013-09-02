$(function() {
	var fancyboxOpts = {
		padding: 0,
		closeBtn: false,
		helpers: {
			thumbs: {
				width  : 75,
				height : 75
			},
			title: {
				type: 'outside'
			}
		}
	};

	var devhubTitle = "Various screenshots taken during development";

	$("#fancybox-devhub").click(function() {
		$.fancybox([
			{
				href  : 'images/devhub1.png',
				title : devhubTitle
			},
			{
				href  : 'images/devhub2.png',
				title : devhubTitle
			},
			{
				href  : 'images/devhub3.png',
				title : devhubTitle
			},
			{
				href  : 'images/devhub4.png',
				title : devhubTitle
			}
		], fancyboxOpts);
	});

	$("#fancybox-memrise-button").click(function() {
		$.fancybox([
			{
				href  : 'images/memrise-button1.png',
				title : 'Promotional image for Chrome Store'
			},
			{
				href  : 'images/memrise-button2.png',
				title : 'Options page powered by Backbone.js'
			}
		], fancyboxOpts);
	});

	$('#avatar').bind('load', onImageLoad);
});

function onImageLoad() {
	var pickRandom = function() {
		return _.first(_.shuffle(_.flatten(arguments)));
	};

	var makeRandomEffect = function(opts) {
		opts = opts || {};

		var effects = [
			function() {
				opts = _.defaults(opts, {
					blockSize  : pickRandom(8, 16),
					duration   : 500,
					randomize  : pickRandom(true, false),
					reverseDir : pickRandom(true, false),
					easing     : Easing.easeOutQuad,
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
			var easingName = pickRandom(_.keys(Easing));
			var dur;
			if (opts.blockSize === 8) {
				dur = _.random(500, 2000);
			} else {
				dur = _.random(3000, 5000);
			}

			opts = _.defaults(opts, {
				duration   : dur,
				randomize  : pickRandom(true, false),
				reverseDir : pickRandom(true, false),
				easing     : Easing[easingName],
				delay      : 5
			});

			return function(canvas, cb) {
				Px.animateTiles(canvas, opts, cb);
			};
		},

		function() {
			return function(canvas, cb) {
				var easingName = pickRandom(_.keys(Easing));
				Px.animate(canvas, {
					easing   : Easing[easingName],
					duration : _.random(1000, 3000),
					start    : opts.blockSize,
					end      : 1
				}, cb);
			};
		}
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
		canvas.width  = image.width;
		canvas.height = image.height;
		canvas.getContext('2d').drawImage(image, 0, 0);
		return canvas;
	};

	var canvas   = convertImageToCanvas(this);
	var ctx      = canvas.getContext('2d');
	var imgDcopy = ctx.getImageData(0, 0, canvas.width, canvas.height);
	$(this).replaceWith(canvas);

	var restore = function() {
		ctx.putImageData(imgDcopy, 0, 0);
	};

	(function() {
		var doEffect = function() {
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
		};

		doEffect();
	})();
}
