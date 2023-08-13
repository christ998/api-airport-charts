const AWS = require("../../config/aws");
const s3 = new AWS.S3();
var pdfjsLib = require("pdfjs-dist/build/pdf.min");
var pdfjsWorker = require("pdfjs-dist/build/pdf.worker")

const { PDFDocument } = require("pdf-lib");

function getIcaoBuffer(req) {
  return new Promise((resolve, reject) => {
    const { country, icao } = req.params; // {country: 'CHL', icao:'scqp'}
    const params = {
      Bucket: "charts-airports-christ998",
      Key: `${country}/${icao}.pdf`,
    };

    s3.getObject(params, async (err, data) => {
      if (err) reject(err);
      resolve(data.Body);
    });
  });
}
async function getPDFPageBuffer(req) {
  return new Promise((resolve, reject) => {
    async function getPage() {
      const arrayBuffer = await getIcaoBuffer(req);
      const { chartname } = req.params;
      const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const pagePDFProxy = await pdf.getPage(pageNumber); //returns object PDFPageProxy
        const content = await pagePDFProxy.getTextContent();
        const pageText = content.items.map((item) => item.str);

        if (pageText.includes(chartname)) {
          const bufferPage = await createPDFPageBuffer(
            pagePDFProxy.pageNumber,
            arrayBuffer
          );
          resolve(new Buffer.from(bufferPage));
        }
      }
      reject("Página no encontrada");
    }

    getPage();
  });
}

async function createPDFPageBuffer(pageNumber, arrayPDFBuffer) {
  return new Promise((resolve, reject) => {
    async function creatingBuffer() {
      const newPdfDoc = await PDFDocument.create();
      const pdfDoc = await PDFDocument.load(arrayPDFBuffer);
      const [page] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(page);
      const pageArrayBuffer = await newPdfDoc.save();
      resolve(pageArrayBuffer);
    }

    creatingBuffer();
  });
}

const getAllObjectKeys = async () => {
  const keys = [];

  let isTruncated = true;
  let continuationToken = null;

  while (isTruncated) {
    const params = {
      Bucket: "charts-airports-christ998",
      ContinuationToken: continuationToken,
    };

    const response = await s3.listObjectsV2(params).promise();

    const contents = response.Contents;
    for (const content of contents) {
      keys.push(content.Key);
    }

    isTruncated = response.IsTruncated;
    continuationToken = response.NextContinuationToken;
  }

  return keys;
};
module.exports = { getIcaoBuffer, getPDFPageBuffer };
