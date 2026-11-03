import type { PageMetaOptions } from '../hooks/usePageMeta';

let serverPageMeta: PageMetaOptions = {};

export function resetServerPageMeta() {
  serverPageMeta = {};
}

export function collectServerPageMeta(meta: PageMetaOptions) {
  serverPageMeta = {
    ...serverPageMeta,
    ...Object.fromEntries(Object.entries(meta).filter(([, value]) => value !== undefined)),
  };
}

export function readServerPageMeta(): PageMetaOptions {
  return serverPageMeta;
}
