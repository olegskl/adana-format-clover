function commonPrefixReducer(a, b) {
  const result = [];
  const minLength = Math.min(a.length, b.length);
  for (let i = 0; i < minLength; i += 1) {
    if (a[i] !== b[i]) { break; }
    result.push(a[i]);
  }
  return result;
}

function findCommonPrefix(splitFilePaths = []) {
  return splitFilePaths.length === 1 ?
    splitFilePaths[0].slice(0, -1) :
    splitFilePaths.reduce(commonPrefixReducer);
}

function extractPackageNames(files) {
  const separator = /\\|\//;
  const splitFilePaths = files.map(file => file.path.split(separator));
  const commonPrefix = findCommonPrefix(splitFilePaths);

  return splitFilePaths.map(splitFilePath => {
    return splitFilePath
      .slice(commonPrefix.length, -1)
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

  return Object.values(packageIndex);
}
