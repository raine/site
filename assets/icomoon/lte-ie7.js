/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-mail' : '&#xe000;',
			'icon-arrow-right' : '&#xe002;',
			'icon-tools' : '&#xe003;',
			'icon-code' : '&#xe004;',
			'icon-code-fork' : '&#xf126;',
			'icon-magic' : '&#xf0d0;',
			'icon-mobile' : '&#xe006;',
			'icon-location' : '&#xe008;',
			'icon-database' : '&#xe009;',
			'icon-linkedin' : '&#xe001;',
			'icon-twitter' : '&#xe005;',
			'icon-github' : '&#xe007;',
			'icon-github-2' : '&#xe00a;',
			'icon-skype' : '&#xe00b;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};