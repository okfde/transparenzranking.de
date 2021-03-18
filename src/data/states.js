import fs from 'fs/promises';
import path from 'path';
import loadYaml from '../utils/loadYaml';
import MarkdownIt from 'markdown-it';
import { fileURLToPath } from 'url';
import serveVirtualFile from '../utils/serveVirtualFile';

const md = new MarkdownIt();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const statesDir = path.join(__dirname, 'states');
const fdsFile = path.join(__dirname, 'fds.yml');

export async function getStates() {
  const fds = await loadYaml(fdsFile);

  const stateFiles = (await fs.readdir(statesDir))
    .filter(f => f.endsWith('.yml'))
    .map(file => path.join(statesDir, file));

  const states = await Promise.all(
    stateFiles.map(async file => {
      const state = await loadYaml(file);
      const mdFile = path.join(file, '..', path.basename(file, '.yml') + '.md');
      const mdRaw = await fs.readFile(mdFile, 'utf-8');

      return {
        ...state,
        slug: path.basename(file, '.yml'),
        fds: fds.find(s => s.id === state.fds_id),
        description: md.render(mdRaw)
      };
    })
  );

  return states;
}

export default serveVirtualFile('states', getStates);
