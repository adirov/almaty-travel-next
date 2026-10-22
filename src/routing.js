export function parseRoute(hash) {
  const [rawPath, search = ''] = (hash.replace(/^#/, '') || '/').split('?');
  const lang = rawPath === '/en' || rawPath.startsWith('/en/') ? 'en' : 'ru';
  let path = rawPath.replace(/^\/en(?=\/|$)/, '') || '/';
  if (path === '/ru/' || path === '/ru') path = '/';
  if (!path.startsWith('/')) path = '/';
  if (lang === 'en' && !['/', '/catalog', '/services', '/order'].includes(path)) path = '/ru' + path;
  return { path, lang, params: new URLSearchParams(search) };
}
export function routeHref(path, lang, params = new URLSearchParams()) {
  let result = path.replace(/^\/(en|ru)(?=\/|$)/, '') || '/';
  if (['/', '/catalog', '/services', '/order'].includes(result)) {
    if (lang === 'en') result = '/en' + result;
  } else result = '/' + lang + result;
  return '#' + result + (params.toString() ? '?' + params.toString() : '');
}
export function contentPath(path, lang) { return path.replace(/^\/(ru|en)\//, '/' + lang + '/'); }
