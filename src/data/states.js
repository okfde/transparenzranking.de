import fs from 'fs/promises';
import path from 'path';
import loadYaml from '../utils/loadYaml';
import MarkdownIt from 'markdown-it';
import { fileURLToPath } from 'url';
import serveVirtualFile from '../utils/serveVirtualFile';
import pointPercentage from '../utils/percentage';
import { getCategories } from './categories';
import { getStateStats } from './fdsStats';

const md = new MarkdownIt();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const statesDir = path.join(__dirname, 'states');
const criteriaFile = path.join(__dirname, 'criteria.yml');
const fdsFile = path.join(__dirname, 'fds.yml');

// see see https://regex101.com/r/pOR9CI/1
const paragraphs = /(§)\s*(\d+)\s*([a-z]*)/;

let idCounter = 0;

export async function getStates(withStats = true) {
  const categories = await getCategories();
  const criteria = await loadYaml(criteriaFile);
  const fdsData = await loadYaml(fdsFile);

  const stateFiles = (await fs.readdir(statesDir))
    .filter(f => f.endsWith('.yml'))
    .map(file => path.join(statesDir, file));

  const states = await Promise.all(
    stateFiles.map(async file => {
      const state = await loadYaml(file);

      const mdFile = path.join(file, '..', path.basename(file, '.yml') + '.md');
      const mdRaw = await fs.readFile(mdFile, 'utf-8');
      const description = md.render(mdRaw);

      const slug = path.basename(file, '.yml');
      const fds = fdsData.find(s => s.id === state.fdsId);

      const stats = withStats ? await getStateStats(state) : undefined;

      const performance = categories.map(category => {
        const details = state.criteria
          ?.filter(c => category.criteriaTitles.includes(c.title))
          .map(criterium => {
            const { maxPoints, description } = criteria.find(
              c => c.title === criterium.title
            );

            let { citationLink } = criterium;
            if (citationLink === undefined) {
              const result = paragraphs.exec(criterium.citation);
              if (result) {
                result.shift();
                const anchor = result.join('');
                citationLink = `https://fragdenstaat.de/gesetz/${fds.law}/#${anchor}`;
              }
            }

            return {
              ...criterium,
              maxPoints,
              citationLink,
              description,
              id: idCounter++
            };
          });

        const achievedPoints = getPoints(state, category.criteriaTitles);
        const percentage = pointPercentage(achievedPoints, category.maxPoints);

        return {
          categorySlug: category.slug,
          details,
          achievedPoints,
          percentage
        };
      });

      return {
        ...state,
        slug,
        fds,
        description,
        performance,
        stats
      };
    })
  );

  return states;
}

export function getPoints(state, criteriaTitles) {
  let achievedPoints = 0;

  if (state.criteria) {
    const stateCriteria = state.criteria.filter(c =>
      criteriaTitles.includes(c.title)
    );

    achievedPoints = stateCriteria.reduce((a, c) => a + c.points, 0);
  }

  return achievedPoints;
}

export default serveVirtualFile('states', getStates);
