import 'babel-polyfill';
import CloverReport from './clover-report';
import analyzeFiles from './analyze-files';
import groupFilesByPackage from './group-files';
import summarizeFiles from './summarize-files';

export default function cloverReporter(coverage) {
  const report = new CloverReport({ indent: true });
  const projectFiles = analyzeFiles(coverage);
  const projectPackages = groupFilesByPackage(projectFiles);
  const projectMetrics = summarizeFiles(projectFiles);

  report
    .startReport()
    .startProject('All Files') // TODO: use name from package.json
    .addProjectMetrics({
      metrics: projectMetrics,
      packages: projectPackages,
      files: projectFiles,
    });

  projectPackages.forEach(({ name, files }) => {
    report
      .startPackage(name)
      .addPackageMetrics(summarizeFiles(files));

    files.forEach(file => {
      report
        .startFile(file)
        .addFileMetrics(file.metrics);
      file.lines.forEach(::report.addLine);
      report.endFile();
    });

    report.endPackage();
  });

  return report.endReport();
}
