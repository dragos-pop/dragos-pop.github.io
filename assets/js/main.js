/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function() {

	var body = document.body,
		header = document.getElementById('header'),
		footer = document.getElementById('footer'),
		main = document.getElementById('main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		window.addEventListener('load', function() {
			window.setTimeout(function() {
				body.classList.remove('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				body.classList.add('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					window.scrollTo(0, window.scrollY + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			main.parentNode.insertBefore(footer, main.nextSibling);
		});

		breakpoints.on('>medium', function() {
			header.appendChild(footer);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				var parallaxTicking = false;

				var parallaxHandler = function() {
					header.style.backgroundPosition = 'left ' + (-1 * (window.scrollY / settings.parallaxFactor)) + 'px';
					parallaxTicking = false;
				};

				var parallaxScrollListener = function() {
					if (!parallaxTicking) {
						window.requestAnimationFrame(parallaxHandler);
						parallaxTicking = true;
					}
				};

				breakpoints.on('<=medium', function() {
					window.removeEventListener('scroll', parallaxScrollListener);
					header.style.backgroundPosition = '';
				});

				breakpoints.on('>medium', function() {
					header.style.backgroundPosition = 'left 0px';
					window.addEventListener('scroll', parallaxScrollListener, { passive: true });
				});

				window.addEventListener('load', function() {
					parallaxHandler();
				});

			}

})();
