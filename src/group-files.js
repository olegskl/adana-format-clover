import findCommonPath from './find-common-path';

const separator = /\\|\//;

function extractPackageNames(files) {
  const splitFilePaths = files.map(file => file.path.split(separator));
  const commonPath = findCommonPath(splitFilePaths);

  return splitFilePaths.map(splitFilePath => {
    return splitFilePath
      .slice(commonPath.length, -1)
      .join('.');
  });
}

export default function groupFilesByPackage(files) {
  const packageIndex = {};
  const packageNames = extractPackageNames(files);

  packageNames.forEach((packageName, i) => {
    if (!packageIndex[packageName]) {
      packageIndex[packageName] = {
        name: packageName,
        files: [],
      };
    }
    packageIndex[packageName].files.push(files[i]);
  });

  return Object.keys(packageIndex).map(key => packageIndex[key]);
}
