export function getAppOrigin() {
  if (typeof window === 'undefined') {
    return '';
  }

  if (window.location.protocol === 'file:') {
    return 'http://localhost:3000';
  }

  return window.location.origin;
}
