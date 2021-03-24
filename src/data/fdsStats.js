import fetch from 'node-fetch';

async function totalCount(url) {
  const data = await fetch(url).then(r => r.json());
  return data.meta.total_count;
}

export async function getStateStats(state) {
  if (process.env.NODE_ENV === 'development') {
    return { all: 1001, successRate: 50 };
  }

  const allUrl = `https://fragdenstaat.de/api/v1/request/?format=json&jurisdiction=${state.fdsId}&limit=1`;
  const successfulUrl = allUrl + '&resolution=successful';

  const all = await totalCount(allUrl);
  const successful = await totalCount(successfulUrl);

  const successRate = Math.round((successful / all) * 100);
  return { all, successRate };
}
