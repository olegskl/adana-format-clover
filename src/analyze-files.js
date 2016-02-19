import path from 'path';
import { lines, metrics, tags } from 'adana-analyze';

const requiredTags = [
  'statement',
  'branch',
  'line',
  'function',
];

function computeMetrics(coverageLocations) {
  const fileMetrics = tags(coverageLocations, requiredTags);
  return Object.keys(fileMetrics).reduce((result, tagName) => {
    result[tagName] = metrics(fileMetrics[tagName]);
    return result;
  }, {});
}

function analyzeFile(filePath, fileCoverage) {
  return {
    name: path.basename(filePath),
    path: filePath,
    lines: lines(fileCoverage.locations),
    metrics: computeMetrics(fileCoverage.locations),
  };
}

export default function analyzeFiles(filesCoverage) {
  return Object.keys(filesCoverage).map(filePath => {
    return analyzeFile(filePath, filesCoverage[filePath]);
  });
}
