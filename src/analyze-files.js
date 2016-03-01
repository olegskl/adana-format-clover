import path from 'path';
import { metrics, tags } from 'adana-analyze';

// FIXME temporary solution:
import { altLines, extendWithLines } from './alt-lines';

const requiredTags = [
  'statement',
  'branch',
  'line',
  'function',
];

function computeMetrics(coverageLocations) {
  const fileMetrics = tags(coverageLocations, requiredTags);

  extendWithLines(fileMetrics, coverageLocations);

  return Object.keys(fileMetrics).reduce((result, tagName) => {
    result[tagName] = metrics(fileMetrics[tagName]);
    return result;
  }, {});
}

function analyzeFile(filePath, fileCoverage) {
  return {
    name: path.basename(filePath),
    path: filePath,
    lines: altLines(fileCoverage.locations),
    metrics: computeMetrics(fileCoverage.locations),
  };
}

export default function analyzeFiles(filesCoverage) {
  return Object.keys(filesCoverage).map(filePath => {
    return analyzeFile(filePath, filesCoverage[filePath]);
  });
}
