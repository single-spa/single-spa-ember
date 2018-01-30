define('single-spa-ember/src/single-spa-ember', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = singleSpaEmber;
	exports.loadEmberApp = loadEmberApp;

	var _extends = Object.assign || function (target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];

			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}

		return target;
	};

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var defaultOpts = {
		// required opts
		App: null,
		// Optional opts
		createOpts: {} // https://www.emberjs.com/api/ember/2.14.1/classes/Ember.Application
	};

	function singleSpaEmber(userOpts) {
		if ((typeof userOpts === 'undefined' ? 'undefined' : _typeof(userOpts)) !== 'object') {
			throw new Error('single-spa-ember requires a configuration object');
		}

		var opts = _extends({}, defaultOpts, userOpts);

		if (!opts.App) {
			throw new Error('single-spa-ember must be passed opts.App');
		}

		if (opts.createOpts && _typeof(opts.createOpts) !== 'object') {
			throw new Error('single-spa-ember: createOpts must be an object to be passed to App.create()');
		}

		return {
			bootstrap: bootstrap.bind(null, opts),
			mount: mount.bind(null, opts),
			unmount: unmount.bind(null, opts)
		};
	}

	function bootstrap(opts) {
		return Promise.resolve();
	}

	function mount(opts) {
		return Promise.resolve().then(function () {
			opts.applicationInstance = opts.App.create(opts.createOpts);
		});
	}

	function unmount(opts) {
		return Promise.resolve().then(function () {
			opts.applicationInstance.destroy();
			opts.applicationInstance = null;
		});
	}

	/* This is a helper function that will load an ember app via script tags and then
  * hook into Ember's built-in module registry (window.define/window.require) in order
  * to pass the app module and it's lifecycle functions to single-spa.
  *
  * appName: the name of the ember application. This will be used to window.require(appName + '/app');
  * appUrl: the url to script tag for the ember application.
  * vendorUrl (optional): if provided, the vendor bundle will be loaded first before the application bundle.
  *   This is optional since you could have more than one single-spa applications written in Ember, but only
  *   one vendor bundle.
  */
	function loadEmberApp(appName, appUrl) {
		var vendorUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		return new Promise(function (resolve, reject) {
			if (typeof appName !== 'string') {
				reject(new Error('single-spa-ember requires an appName string as the first argument'));
				return;
			}

			if (typeof appUrl !== 'string') {
				reject(new Error('single-spa-ember requires an appUrl string as the second argument'));
				return;
			}

			if (vendorUrl && typeof vendorUrl !== 'string') {
				reject(new Error('single-spa-ember vendorUrl (the third argument) is optional, but must be a string if present'));
				return;
			}

			if (vendorUrl) {
				var scriptVendor = document.createElement('script');
				scriptVendor.src = vendorUrl;
				scriptVendor.async = true;
				scriptVendor.onload = loadApp;
				scriptVendor.onerror = reject;
				document.head.appendChild(scriptVendor);
			} else {
				loadApp();
			}

			function loadApp() {
				var scriptEl = document.createElement('script');
				scriptEl.src = appUrl;
				scriptEl.async = true;
				scriptEl.onload = function () {
					resolve(window.require(appName + '/app'));
				};
				scriptEl.onerror = reject;
				document.head.appendChild(scriptEl);
			}
		});
	}
});
//# sourceMappingURL=single-spa-ember.js.map