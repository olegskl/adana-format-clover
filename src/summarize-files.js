export default function summarize(files) {
  return files.reduce((result, { metrics }) => {
    Object.keys(metrics).forEach(tagName => {
      const { passed, total } = metrics[tagName];
      if (result[tagName]) {
        result[tagName].passed += passed;
        result[tagName].total += total;
      } else {
        result[tagName] = { passed, total };
      }
    });
    return result;
  }, {});
}
