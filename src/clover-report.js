import XMLWriter from 'xml-writer';

function objectSubkeyValueSum(obj, subkey) {
  return Object.keys(obj).reduce((result, key) => {
    return result + obj[key][subkey];
  }, 0);
}

export default class CloverReport extends XMLWriter {

  constructor({ indent, writer }) {
    super(indent, writer);
    this.unixTimestamp = Math.floor(Date.now() / 1000);
  }

  startReport() {
    return this
      .startDocument('1.0', 'UTF-8')
      .startElement('coverage')
      .writeAttribute('generated', this.unixTimestamp)
      .writeAttribute('clover', '3.2.0');
  }

  endReport() {
    return this
      .endElement()
      .endDocument();
  }

  startProject(name) {
    return this
      .startElement('project')
      .writeAttribute('timestamp', this.unixTimestamp)
      .writeAttribute('name', name);
  }

  endProject() {
    return this.endElement();
  }

  writeMetricsAttributes(metrics) {
    const elements = objectSubkeyValueSum(metrics, 'total');
    const coveredElements = objectSubkeyValueSum(metrics, 'passed');
    return this
      .writeAttribute('statements', metrics.statement.total)
      .writeAttribute('coveredstatements', metrics.statement.passed)
      .writeAttribute('conditionals', metrics.branch.total)
      .writeAttribute('coveredconditionals', metrics.branch.passed)
      .writeAttribute('methods', metrics.function.total)
      .writeAttribute('coveredmethods', metrics.function.passed)
      .writeAttribute('elements', elements)
      .writeAttribute('coveredelements', coveredElements)
      .writeAttribute('loc', metrics.line.total)
      .writeAttribute('ncloc', metrics.line.total);
  }

  addProjectMetrics({ metrics, packages, files }) {
    return this
      .startElement('metrics')
      .writeMetricsAttributes(metrics)
      .writeAttribute('complexity', 0)
      .writeAttribute('packages', packages.length)
      .writeAttribute('files', files.length)
      .writeAttribute('classes', files.length)
      .endElement();
  }

  startPackage(name) {
    return this
      .startElement('package')
      .writeAttribute('name', name);
  }

  endPackage() {
    return this.endElement();
  }

  addPackageMetrics(metrics) {
    return this
      .startElement('metrics')
      .writeMetricsAttributes(metrics)
      .endElement();
  }

  startFile({ name, path }) {
    return this
      .startElement('file')
      .writeAttribute('name', name)
      .writeAttribute('path', path);
  }

  endFile() {
    return this.endElement();
  }

  addFileMetrics(metrics) {
    return this
      .startElement('metrics')
      .writeMetricsAttributes(metrics)
      .endElement();
  }

  addLine({ line, count }) {
    return this
      .startElement('line')
      .writeAttribute('num', line)
      .writeAttribute('count', count)
      .writeAttribute('type', 'stmt') // TODO: can there be many types?
      .endElement();
  }

}
