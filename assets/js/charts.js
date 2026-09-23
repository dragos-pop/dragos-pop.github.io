/*
	Charts
	Lightweight SVG chart renderer shared across project pages.
	Follows the site's theme variables (--chart-accent, --text-*, --border-color)
	so charts stay in sync with light/dark mode automatically.
*/
(function () {

	function measureTextWidth(text, fontSize) {
		var canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement('canvas'));
		var ctx = canvas.getContext('2d');
		ctx.font = fontSize + 'px "Source Sans Pro", sans-serif';
		return ctx.measureText(text).width;
	}

	function niceTicks(maxValue, count) {
		var rawStep = maxValue / count;
		var magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
		var residual = rawStep / magnitude;
		var step;
		if (residual > 5) step = 10 * magnitude;
		else if (residual > 2) step = 5 * magnitude;
		else if (residual > 1) step = 2 * magnitude;
		else step = magnitude;
		var ticks = [];
		for (var v = 0; v <= maxValue + step * 0.001; v += step) ticks.push(Math.round(v * 100) / 100);
		return ticks;
	}

	function svgEl(tag, attrs) {
		var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
		for (var k in attrs) el.setAttribute(k, attrs[k]);
		return el;
	}

	function roundedBarPath(x0, y0, w, h, r) {
		r = Math.max(0, Math.min(r, w, h / 2));
		if (w <= 0) return 'M' + x0 + ',' + y0 + ' L' + x0 + ',' + (y0 + h) + ' Z';
		return 'M' + x0 + ',' + y0 +
			' L' + (x0 + w - r) + ',' + y0 +
			' Q' + (x0 + w) + ',' + y0 + ' ' + (x0 + w) + ',' + (y0 + r) +
			' L' + (x0 + w) + ',' + (y0 + h - r) +
			' Q' + (x0 + w) + ',' + (y0 + h) + ' ' + (x0 + w - r) + ',' + (y0 + h) +
			' L' + x0 + ',' + (y0 + h) + ' Z';
	}

	// Renders a horizontal chart (bar or dot-line) into `container`.
	// opts: {
	//   type: 'bar' | 'line' (default 'bar'),
	//   title: string,
	//   data: [{ label, value }],
	//   valueFormat: fn(value) -> string,
	//   tickCount: number (default 4),
	//   plotWidth: number (default 430)
	// }
	function render(container, opts) {
		opts = opts || {};
		var type = opts.type === 'line' ? 'line' : 'bar';
		var data = opts.data || [];
		var title = opts.title || '';
		var valueFormat = opts.valueFormat || function (v) { return String(v); };
		var fontSize = 13;
		var tickFontSize = 12;

		var maxDataValue = Math.max.apply(null, data.map(function (d) { return d.value; }));
		var ticks = niceTicks(maxDataValue, opts.tickCount || 4);
		var maxTick = ticks[ticks.length - 1];

		var maxLabelWidth = Math.max.apply(null, data.map(function (d) { return measureTextWidth(d.label, fontSize); }).concat([0]));
		var maxValueWidth = Math.max.apply(null, data.map(function (d) { return measureTextWidth(valueFormat(d.value), fontSize); }).concat([0]));

		var marginLeft = Math.ceil(maxLabelWidth) + 14;
		var marginRight = Math.ceil(maxValueWidth) + 22;
		var marginTop = title ? 34 : 16;
		var marginBottom = 34;

		var rowHeight = 48;
		var plotHeight = rowHeight * data.length;
		var plotWidth = opts.plotWidth || 430;

		var width = marginLeft + plotWidth + marginRight;
		var height = marginTop + plotHeight + marginBottom;

		function x(v) { return marginLeft + (v / maxTick) * plotWidth; }

		var svg = svgEl('svg', {
			viewBox: '0 0 ' + width + ' ' + height,
			width: '100%',
			height: 'auto',
			role: 'img',
			'aria-label': title || 'chart',
			style: 'max-width: ' + width + 'px;'
		});

		if (title) {
			var titleText = svgEl('text', { class: 'chart-title', x: width / 2, y: 18, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 600 });
			titleText.textContent = title;
			svg.appendChild(titleText);
		}

		var plotTop = marginTop;
		var plotBottom = marginTop + plotHeight;

		ticks.forEach(function (tick) {
			var gx = x(tick);
			svg.appendChild(svgEl('line', { class: 'chart-grid', x1: gx, y1: plotTop, x2: gx, y2: plotBottom, 'stroke-width': 1 }));
			var tickLabel = svgEl('text', { class: 'chart-tick', x: gx, y: plotBottom + 18, 'text-anchor': 'middle', 'font-size': tickFontSize });
			tickLabel.textContent = valueFormat(tick);
			svg.appendChild(tickLabel);
		});

		var points = [];

		data.forEach(function (d, i) {
			var rowCenter = plotTop + rowHeight * i + rowHeight / 2;
			var label = svgEl('text', { class: 'chart-label', x: marginLeft - 7, y: rowCenter, 'text-anchor': 'end', 'dominant-baseline': 'central', 'font-size': fontSize });
			label.textContent = d.label;
			svg.appendChild(label);

			var endX = x(d.value);
			points.push([endX, rowCenter]);

			if (type === 'bar') {
				var barHeight = 22;
				var path = svgEl('path', { class: 'chart-bar', d: roundedBarPath(marginLeft, rowCenter - barHeight / 2, endX - marginLeft, barHeight, 4) });
				var barTitle = svgEl('title', {});
				barTitle.textContent = d.label + ': ' + valueFormat(d.value);
				path.appendChild(barTitle);
				svg.appendChild(path);
			} else {
				svg.appendChild(svgEl('line', { class: 'chart-grid', x1: marginLeft, y1: rowCenter, x2: endX, y2: rowCenter, 'stroke-width': 1, 'stroke-dasharray': '2,3' }));
			}

			var valueLabel = svgEl('text', { class: 'chart-value', x: endX + (type === 'bar' ? 6 : 10), y: rowCenter, 'dominant-baseline': 'central', 'font-size': fontSize });
			valueLabel.textContent = valueFormat(d.value);
			svg.appendChild(valueLabel);
		});

		if (type === 'line') {
			svg.appendChild(svgEl('polyline', {
				class: 'chart-line',
				points: points.map(function (p) { return p.join(','); }).join(' '),
				'stroke-width': 2
			}));
			points.forEach(function (p, i) {
				var dot = svgEl('circle', { class: 'chart-dot', cx: p[0], cy: p[1], r: 5 });
				var dotTitle = svgEl('title', {});
				dotTitle.textContent = data[i].label + ': ' + valueFormat(data[i].value);
				dot.appendChild(dotTitle);
				svg.appendChild(dot);
			});
		}

		container.innerHTML = '';
		container.appendChild(svg);
	}

	window.Charts = { render: render };

})();
