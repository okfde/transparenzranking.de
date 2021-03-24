import fs from 'fs/promises';
import yaml from 'yaml';

export default file => fs.readFile(file, 'utf8').then(yaml.parse);
