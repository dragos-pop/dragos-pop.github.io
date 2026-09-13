(function () {

	var btn = document.getElementById('theme-toggle');
	if (!btn) return;

	function icon(theme) {
		return theme === 'dark' ? '☀' : '☾';
	}

	btn.textContent = icon(document.documentElement.getAttribute('data-theme'));

	btn.addEventListener('click', function () {
		var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', next);
		localStorage.setItem('theme', next);
		btn.textContent = icon(next);
	});

})();
