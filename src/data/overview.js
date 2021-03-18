import path from 'path';
import { fileURLToPath } from 'url';
import loadYaml from '../utils/loadYaml';
import DefaultObj from '../utils/DefaultObj';
import serveVirtualFile from '../utils/serveVirtualFile';
import { getStates } from './states';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const categoriesFile = path.join(__dirname, 'categories.yml');
const criteriaFile = path.join(__dirname, 'criteria.yml');

async function overview() {
  const categories = await loadYaml(categoriesFile);
  const criteria = await loadYaml(criteriaFile);

  const states = await getStates();

  const bars = new DefaultObj(() => ({ states: [] }));

  for (const { title: category, color, description } of categories) {
    const correspondingCriteria = criteria.filter(
      c => c.category === category || category === 'Gesamt'
    );
    const criteriaTitles = correspondingCriteria.map(c => c.title);
    const maxPoints = correspondingCriteria.reduce(
      (a, c) => a + c.max_points,
      0
    );

    bars[category].color = color;
    bars[category].description = description;

    for (const state of states) {
      let achievedPoints = 0;

      if (state.criteria) {
        const stateCriteria = state.criteria.filter(c =>
          criteriaTitles.includes(c.title)
        );

        achievedPoints = stateCriteria.reduce((a, c) => a + c.points, 0);
      }

      const points = Math.round((achievedPoints / maxPoints) * 100);
      bars[category].states.push({
        state: { slug: state.slug, name: state.name, short: state.short },
        points
      });
    }

    bars[category].states.sort((a, b) => b.points - a.points);
  }

  const clean = { ...bars, toJSON: undefined };
  return clean;
}

export default serveVirtualFile('overview', overview);
