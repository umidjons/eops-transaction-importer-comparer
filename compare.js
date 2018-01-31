const mongo = require('mongodb');

(async () => {
  const client = await mongo.MongoClient.connect('mongodb://localhost:27019');
  const db = client.db('paycom');

  async function getRRNs(db) {
    const results = [];
    const cursor = await db.collection('receipts').find({
      merchant: mongo.ObjectId("55ae373aea05384bd72e2eaa"),
      state: 4,
      //pay_time: {$gte: 1485889200000},
      'receivers.id': mongo.ObjectId("55ae47c2ea05384bd72e2eaf")
    }, {projection: {'receivers.rrn': 1}});
    while (await cursor.hasNext()) {
      const rcpt = await cursor.next();
      results.push(rcpt.receivers[0].rrn);
    }
    return results;
  }

  const existing = await getRRNs(db);
  console.log('Receipts count from Paycom:', existing.length);

  let i = 0;
  const cursor = await db.collection('uzonline_namangan_receipts').find({date: {$gte: 1485889200000}});
  while (await cursor.hasNext()) {
    const rcpt = await cursor.next();
    if (!existing.includes(rcpt.txId)) {
      console.log(++i, 'Not found:', rcpt.txId);
    }
  }
  client.close();
})();
