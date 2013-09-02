// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var Px = (function() {
	var shuffle = function(array) {
		var counter = array.length, temp, index;

		while (counter--) {
			index = (Math.random() * counter) | 0;
			temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	};

	var setPixel = function(imgD, x, y, r, g, b, a) {
		index = (x + y * imgD.width) * 4;
		imgD.data[index+0] = r;
		imgD.data[index+1] = g;
		imgD.data[index+2] = b;
		imgD.data[index+3] = a;
	};

	var getPixel = function(imgD, x, y) {
		index = (x + y * imgD.width) * 4;
		return [
			imgD.data[index+0],
			imgD.data[index+1],
			imgD.data[index+2],
			imgD.data[index+3]
		];
	};

	// Get average color for a tile at coords and write to ImageData
	var drawAveragePixels = function(imgD, x, y, size) {
		var avgR, avgG, avgB;
		avgR = avgG = avgB = 0;
		var pixCount = 0;
		var _x, _y;

		// Count RGB values to count average for tile
		for (_y = y; _y < y + size && _y < imgD.height; _y++) {
			for (_x = x; _x < x + size && _x < imgD.width; _x++) {
				var pix = getPixel(imgD, _x, _y);
				avgR += pix[0];
				avgG += pix[1];
				avgB += pix[2];
				pixCount++;
			}
		}

		avgR = Math.round(avgR / pixCount);
		avgG = Math.round(avgG / pixCount);
		avgB = Math.round(avgB / pixCount);

		for (_y = y; _y < y + size && _y < imgD.height; _y++) {
			for (_x = x; _x < x + size && _x < imgD.width; _x++) {
				setPixel(imgD, _x, _y, avgR, avgG, avgB, 255);
			}
		}
	};

	// Breaks a canvas down to multiple tiles of ImageData
	var breakCanvasToTiles = function(canvas, blockSize, swapDir) {
		var ctx = canvas.getContext('2d');
		var imgds = [];

		// Get ImageData for all blocks
		for (var x = 0; x < canvas.width; x += blockSize) {
			for (var y = 0; y <= canvas.height; y += blockSize) {
				var ox = canvas.width - x;
				var oy = canvas.height - y;
				var width  = (ox < blockSize) ? ox : blockSize;
				var height = (oy < blockSize) ? oy : blockSize;
				if (width === 0 || height === 0) break;

				// Go vertically from left to right by default, horizontally from
				// top to bottom with `swapDir`
				var _x = x, _y = y;
				if (swapDir) _x = [_y, _y = _x][0];

				var imgd = ctx.getImageData(_x, _y, width, height);
				imgd.x = _x;
				imgd.y = _y;
				imgds.push(imgd);
			}
		}

		return imgds;
	};

	// Go through an ImageData tile by tile determined by `size` and call
	// drawAveragePixels for each tile
	var pixelateImageData = function(imgD, size) {
		if (size < 1) size = 1;
		for (var y = 0; y < imgD.height; y += size ) {
			for (var x = 0; x < imgD.height; x += size ) {
				drawAveragePixels(imgD, x, y, size);
			}
		}
	};

	var animate = function(opts, cb) {
		var animLoop = function(render) {
			var running, lastFrame = +new Date();

			var loop = function(now) {
				if (running !== false) {
					requestAnimationFrame(loop);
					running = render(now - lastFrame);
					lastFrame = now;
				} else {
					if (cb) cb();
				}
			};

			loop(lastFrame);
		};

		var start    = +new Date();
		var duration = opts.duration || 2000;

		animLoop(function(deltaT) {
			var timePassed = new Date() - start;
			if (timePassed < duration) {
				var delta = opts.easing(timePassed, opts.start, opts.end - opts.start, duration);
				opts.step(delta);
			} else {
				return false;
			}
		});
	};

	var pixelateAnimate = function(ctx, imgD, opts, cb) {
		var buffer = new Uint8ClampedArray(imgD.data);
		var prevSize = 0;
		var render = function(delta) {
			var size = Math.round(delta);
			if (size !== prevSize) {
				pixelateImageData(imgD, size);
				ctx.putImageData(imgD, imgD.x || 0, imgD.y || 0);
				imgD.data.set(buffer);
				prevSize = size;
			}
		};

		opts.start    = opts.start || 2;
		opts.duration = opts.duration || 2000;
		opts.easing   = opts.easing || Easing.easeOutQuad;

		if (opts.end === undefined) {
			opts.end = opts.blockSize || 16;
		}

		animate({
			duration : opts.duration,
			start    : opts.start,
			end      : opts.end,
			easing   : opts.easing,
			step     : render
		}, cb);
	};

	var pixelateOneByOne = function(ctx, imgDarr, opts, cb) {
		opts.delay = opts.delay || 10;

		var next = function(i) {
			var imgD = imgDarr[i];
			var done;

			if (i === imgDarr.length-1) done = cb;
			pixelateAnimate(ctx, imgD, opts, done);

			if (i < imgDarr.length-1) {
				setTimeout(function() {
					next(i+1);
				}, opts.delay);
			}
		};

		next(0);
	};

	return {
		// Pixelate the canvas with blockSize as the size of a tile
		pixelate: function(canvas, blockSize) {
			var ctx  = canvas.getContext('2d');
			var imgD = ctx.getImageData(0, 0, canvas.width, canvas.height);
			pixelateImageData(imgD, blockSize);
			ctx.putImageData(imgD, 0, 0);
		},

		// Animate pixelation of a canvas
		animate: function(canvas, opts, cb) {
			var ctx  = canvas.getContext('2d');
			var imgD = ctx.getImageData(0, 0, canvas.width, canvas.height);
			pixelateAnimate(ctx, imgD, opts, cb);
		},

		animateTiles: function(canvas, opts, cb) {
			if (opts.blockSize !== undefined) {
				opts.end   = opts.blockSize;
				opts.start = 1;
			}

			if (opts.reverse) {
				opts.start = [opts.end, opts.end = opts.start][0];
			}

			// TODO: might not be needed
			blockSize = Math.max(opts.start, opts.end);

			var imgDarr = breakCanvasToTiles(canvas, blockSize);
			if (opts.reverseDir) imgDarr.reverse()

			// The whole canvas needs to be pixelated at `opts.start` block size
			if (opts.start > opts.end) {
				Px.pixelate(canvas, opts.start);
			}

			var ctx = canvas.getContext('2d');
			if (opts.randomize) shuffle(imgDarr);
			pixelateOneByOne(ctx, imgDarr, opts, cb);
		}
	};
}());
