$(function() {
	var fancyboxOpts = {
		padding: 0,
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
				title : 'Options page'
			}
		], fancyboxOpts);
	});
});
