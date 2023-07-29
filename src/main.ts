import globalCSS from './assets/main.scss?inline';
import cssRootVariable from './assets/theme.scss?inline';
import { createApp, ref, watch } from 'vue';
import App from './App.vue';

const app = createApp(App);

const stylesLoaded = ref(false);

const mountPoint = document.createElement('div');
const container = document.querySelector('#app') as HTMLDivElement;

/**
 * movingg relevant styles to the shadow root
 */
setTimeout(() => {
  let shadowRoot: ShadowRoot;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(globalCSS);
  if (import.meta.env.PROD) {
    shadowRoot = container.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(mountPoint);
    const appStyles = document.querySelector('#core-css') as HTMLStyleElement;
    mountPoint.insertAdjacentElement('afterend', appStyles);
  }

  if (import.meta.env.MODE === 'shadow') {
    shadowRoot = container.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(mountPoint);

    const appStyles = document.querySelectorAll('style');
    appStyles.forEach((style) => {
      mountPoint.insertAdjacentElement('afterend', style);
    });
    shadowRoot.adoptedStyleSheets = [sheet];
  }
  /** this is the theme/root sccs variable */

  container.innerHTML += `
  <style>
    ${cssRootVariable}
  </style>`;
  stylesLoaded.value = true;
}, 1000);

watch(
  stylesLoaded,
  (stylesLoadedValue) => {
    if (stylesLoadedValue) {
      app.mount(import.meta.env.MODE !== 'development' ? mountPoint : container);
    }
  },
  { immediate: true }
);
