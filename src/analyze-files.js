import path from 'path';
import { lines, metrics, tags } from 'adana-analyze';

const requiredTags = [
  'statement',
  'branch',
  'line',
  'function',
];

function computeMetrics(coverageLocations) {
  return Object
    .entries(tags(coverageLocations, requiredTags))
    .reduce((result, [ tagName, tagData ]) => {
      result[tagName] = metrics(tagData);
      return result;
    }, {});
}

function analyzeFile([ filePath, fileCoverage ]) {
  return {
    name: path.basename(filePath),
    path: filePath,
    lines: lines(fileCoverage.locations),
    metrics: computeMetrics(fileCoverage.locations),
  };
}

export default function analyzeFiles(filesCoverage) {
  return Object
    .entries(filesCoverage)
    .map(analyzeFile);
}
