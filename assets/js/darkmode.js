(function () {

	var btn = document.getElementById('theme-toggle');
	if (!btn) return;

	function icon(theme) {
		return theme === 'dark' ? '☀' : '☾';
	}

	function update(theme) {
		btn.textContent = icon(theme);
		btn.setAttribute('aria-pressed', String(theme === 'dark'));
	}

	update(document.documentElement.getAttribute('data-theme'));

	btn.addEventListener('click', function () {
		var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', next);
		localStorage.setItem('theme', next);
		update(next);
	});

})();
