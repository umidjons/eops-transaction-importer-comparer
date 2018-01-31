const mongo = require('mongodb');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const moment = require('moment');

if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); 
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

async function run() {
  const client = await mongo.MongoClient.connect('mongodb://localhost:27019');
  const db = client.db('paycom');
  const documents = await parseCsv();
  if (documents.length) {
    for (const doc of documents) {
      const res = await db.collection('uzonline_namangan_receipts').insertOne(doc);
    }
  }
  console.log('Done.');
}

async function parseCsv() {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync('./data/tmp001.csv', 'utf-8');
    const results = [];
    const lines = fileContent.split(/\r?\n/);

    for (const line of lines) {
      if (!line) {
        continue;
      }
      const parsed = parse(line)[0];
      if (parsed[0].trim()) {
        const ts = 1 * moment(parsed[5] + ' ' + parsed[6], 'YYYYMMDD HH:mm:ss').format('x');
        results.push({
          amount: 100 * parsed[1],
          rs: parsed[2],
          txId: parsed[3].padStart(12, '0'),
          card: parsed[4],
          date_str: parsed[5],
          time_str: parsed[6],
          date: ts
        });
      }
    }
    resolve(results);
  });
}

(async () => {
  await run();
})();
