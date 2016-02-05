export default function summarize(files) {
  return files.reduce((result, { metrics }) => {
    Object
      .entries(metrics)
      .forEach(([ tagName, { passed, total } ]) => {
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
