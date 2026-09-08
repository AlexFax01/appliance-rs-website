// Test-only Google API contract substitute. No real tiles, account, or billing.
(() => {
  const script = document.currentScript;
  const callback = new URL(script.src).searchParams.get('callback');
  const state = window.__mapTest = { creates: 0, fits: 0, pans: 0, markers: [] };
  class Map {
    constructor(element, options) {
      this.element = element; this.options = options; this.zoom = options.zoom;
      state.creates++; state.map = this;
      element.style.background = '#e8eff6';
      element.dataset.testMap = 'provider substitute';
    }
    addListener() { return { remove() {} }; }
    getZoom() { return this.zoom; }
    getMapCapabilities() { return { isAdvancedMarkersAvailable: true }; }
    fitBounds() { state.fits++; }
    panTo(position) { state.pans++; state.position = position; }
  }
  class AdvancedMarkerElement {
    constructor(options) {
      this.map = options.map; this.options = options;
      const button = this.button = document.createElement('button');
      button.type = 'button'; button.setAttribute('aria-label', options.title);
      button.style.cssText = 'position:absolute;padding:0;border:0;background:transparent;';
      button.style.left = `${8 + (options.position.lng + 82.46) / .64 * 78}%`;
      button.style.top = `${8 + (35.19 - options.position.lat) / .49 * 78}%`;
      button.append(options.content); options.map.element.append(button);
      state.markers.push(this);
    }
    addListener(type, fn) { this.button.addEventListener(type, fn); return { remove: () => this.button.removeEventListener(type, fn) }; }
  }
  Object.assign(window.google.maps, {
    Map, marker: { AdvancedMarkerElement },
    LatLngBounds: class { extend() {} },
    event: {
      addListenerOnce(map, name, fn) { const timer = setTimeout(fn, 50); return { remove: () => clearTimeout(timer) }; },
      clearInstanceListeners() {},
    },
    importLibrary: async name => name === 'maps' ? { Map } : { AdvancedMarkerElement },
    __ib__: window.google.maps.__ib__,
  });
  callback.split('.').reduce((value, key) => value[key], window)();
})();
