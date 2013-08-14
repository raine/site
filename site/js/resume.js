$(function() {
	$(".fancybox")
		.attr('rel', 'gallery')
		.fancybox({
			padding: 0,
			helpers: {
				thumbs: {
					width: 75,
					height: 75
				}
			}
		});
});
