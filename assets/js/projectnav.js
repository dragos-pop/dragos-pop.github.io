(function () {

	var allProjects = window.PROJECTS || [];
	var currentFile = decodeURIComponent(window.location.pathname.split('/').pop());
	var filter = new URLSearchParams(window.location.search).get('filter');

	var list = filter ? allProjects.filter(function (p) { return p.tag === filter; }) : allProjects;
	var idx = list.findIndex(function (p) { return p.file === currentFile; });

	// current project isn't in the filtered list (stale/invalid filter) - fall back to full order
	if (idx === -1) {
		filter = null;
		list = allProjects;
		idx = list.findIndex(function (p) { return p.file === currentFile; });
	}

	var suffix = filter ? '?filter=' + encodeURIComponent(filter) : '';
	var prev = idx > -1 && idx + 1 < list.length ? list[idx + 1] : null;
	var next = idx > -1 && idx - 1 >= 0 ? list[idx - 1] : null;

	var prevBtn = document.getElementById('prev-project');
	var nextBtn = document.getElementById('next-project');
	var homeLink = document.getElementById('home-link');

	if (prevBtn) {
		if (prev) { prevBtn.href = prev.file + suffix; prevBtn.hidden = false; }
		else prevBtn.hidden = true;
	}
	if (nextBtn) {
		if (next) { nextBtn.href = next.file + suffix; nextBtn.hidden = false; }
		else nextBtn.hidden = true;
	}
	if (homeLink) homeLink.href = 'index.html' + suffix;

})();
