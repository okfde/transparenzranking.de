import xmlParser from 'xml2json';
import chroma from 'chroma-js';
import { extendDefaultPlugins, optimize } from 'svgo';
import fs from 'fs/promises';
import path from 'path';
import { getStates } from './states';
import { compileTemplate } from '@vue/compiler-sfc';

const MAP = path.join(__dirname, 'src/data/map.svg');
let handle;

const scale = chroma
  .scale(['#9a0052', '#f7a600', '#6dffd4'])
  .mode('lch')
  .colors(100);

async function renderSvg() {
  const states = await getStates(false);
  const map = await fs.readFile(MAP, { encoding: 'utf-8' });

  const root = xmlParser.toJson(map, { reversible: true, object: true });
  for (const state of states) {
    const el = root.svg.g.path.find(p => p.id === state.slug);
    if (el) {
      el.fill = scale[state.performance[0].percentage];
    }
  }
  const raw = xmlParser.toXml(root);
  return optimize(raw, {
    plugins: extendDefaultPlugins([{ name: 'cleanupIDs', active: false }])
  }).data;
}

export default function () {
  const virtualFileId = '@data/map';

  return {
    name: 'virtual-map',
    resolveId(id) {
      if (id.startsWith(virtualFileId)) {
        return id;
      }
    },
    async configureServer(server) {
      const svg = await renderSvg();
      server.middlewares.use((req, res, next) => {
        if (req.url === `/${virtualFileId}`) {
          res.setHeader('Content-Type', 'image/svg+xml');
          return res.end(svg, 'utf-8');
        }
        next();
      });
    },
    async load(id) {
      if (id.startsWith(virtualFileId)) {
        const svg = await renderSvg();

        if (id.endsWith('?component')) {
          const { code } = compileTemplate({
            id: JSON.stringify(id),
            source: svg,
            transformAssetUrls: false
          });

          return `${code}\nexport default render`;
        }

        if (this.meta.watchMode) {
          return `const data = '/${virtualFileId}'; export default data;`;
        }

        handle = this.emitFile({
          name: 'map.svg',
          source: svg,
          type: 'asset'
        });
        return `export default import.meta.ROLLUP_FILE_URL_${handle};`;
      }
    }
  };
}
