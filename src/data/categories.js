import path from 'path';
import { fileURLToPath } from 'url';
import serveVirtualFile from '../utils/serveVirtualFile';
import loadYaml from '../utils/loadYaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const categoriesFile = path.join(__dirname, 'categories.yml');
const criteriaFile = path.join(__dirname, 'criteria.yml');

export async function getCategories() {
  const categories = await loadYaml(categoriesFile);
  const criteria = await loadYaml(criteriaFile);

  return categories.map(({ title, slug, color, description }) => {
    const correspondingCriteria = criteria.filter(
      c => c.category === slug || title === 'Gesamt'
    );
    const criteriaTitles = correspondingCriteria.map(c => c.title);
    const maxPoints = correspondingCriteria.reduce(
      (a, c) => a + c.maxPoints,
      0
    );

    return { title, slug, criteriaTitles, maxPoints, color, description };
  });
}

// map array to obj
export default serveVirtualFile('categories', async () =>
  (await getCategories()).reduce((obj, category) => {
    obj[category.slug] = category;
    return obj;
  }, {})
);
