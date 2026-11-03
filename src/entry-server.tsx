import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { readServerPageMeta, resetServerPageMeta } from './lib/serverPageMeta';

export function render(url: string) {
  resetServerPageMeta();
  const html = renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  );
  return { html, meta: readServerPageMeta() };
}
