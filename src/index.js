import { startCat } from './cat.js';
import { catMarkup } from './markup.js';

let active = null;
/** Mount one cat per document. Call destroy() before mounting another. */
export function createCat(options = {}) {
  if (active) throw new Error('A homepage cat is already mounted. Call destroy() first.');
  const resolve = value => typeof value === 'string' ? document.querySelector(value) : value;
  const root = resolve(options.root) || document.body;
  const track = resolve(options.track);
  if (!(track instanceof HTMLElement) || !track.isConnected) {
    throw new TypeError('createCat requires a connected track element or selector.');
  }
  if (!(root instanceof HTMLElement) || !root.contains(track)) {
    throw new TypeError('The root must contain the track.');
  }
  const hadTrackClass = track.classList.contains('cat-track');
  track.classList.add('cat-track');
  const template = document.createElement('template');
  template.innerHTML = catMarkup;
  const cat = template.content.firstElementChild;
  track.append(cat);
  const controller = startCat(cat, track, {
    ...options, root,
    portrait: resolve(options.portrait),
    portraitImage: resolve(options.portraitImage),
  });
  const destroy = controller.destroy.bind(controller);
  let destroyed = false;
  controller.destroy = () => {
    if (destroyed) return;
    destroyed = true;
    destroy();
    if (!hadTrackClass) track.classList.remove('cat-track');
    active = null;
  };
  active = controller;
  return controller;
}
