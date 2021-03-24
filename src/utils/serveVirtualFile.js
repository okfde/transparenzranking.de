export default function (name, handler) {
  const virtualFileId = '@data/' + name;

  return () => ({
    name,
    resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId;
      }
    },
    async load(id) {
      if (id === virtualFileId) {
        const data = await Promise.resolve(handler());
        return `const data = ${JSON.stringify(data)}; export default data;`;
      }
    }
  });
}
