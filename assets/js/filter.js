(function () {

	var container = document.querySelector('#one .row');
	if (!container) return;

	var articles = Array.prototype.slice.call(container.querySelectorAll('article[data-tag]'));
	var tags = [];
	articles.forEach(function (a) {
		var t = a.getAttribute('data-tag');
		if (tags.indexOf(t) === -1) tags.push(t);
	});

	var bar = document.createElement('div');
	bar.className = 'filter-bar';

	function makeButton(label, value) {
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'button small filter-btn';
		btn.textContent = label;
		btn.dataset.filter = value;
		btn.setAttribute('aria-pressed', 'false');
		return btn;
	}

	bar.appendChild(makeButton('All', ''));
	tags.forEach(function (t) { bar.appendChild(makeButton(t, t)); });
	container.parentNode.insertBefore(bar, container);

	function applyFilter(tag) {
		articles.forEach(function (a) {
			var match = !tag || a.getAttribute('data-tag') === tag;
			a.hidden = !match;

			var suffix = tag ? '?filter=' + encodeURIComponent(tag) : '';
			Array.prototype.forEach.call(a.querySelectorAll('a[href]'), function (link) {
				var base = link.getAttribute('href').split('?')[0];
				link.setAttribute('href', base + suffix);
			});
		});

		Array.prototype.forEach.call(bar.querySelectorAll('.filter-btn'), function (b) {
			var isActive = (b.dataset.filter || null) === tag;
			b.classList.toggle('primary', isActive);
			b.setAttribute('aria-pressed', String(isActive));
		});

		var url = new URL(window.location.href);
		if (tag) url.searchParams.set('filter', tag);
		else url.searchParams.delete('filter');
		window.history.replaceState(null, '', url);
	}

	bar.addEventListener('click', function (e) {
		var btn = e.target.closest('.filter-btn');
		if (!btn) return;
		applyFilter(btn.dataset.filter || null);
	});

	var initial = new URLSearchParams(window.location.search).get('filter');
	applyFilter(tags.indexOf(initial) > -1 ? initial : null);

})();
