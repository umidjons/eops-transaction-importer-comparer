# Importer and comparer

## Importer

`import.js` script parses CSV file and imports into mongo collection.

CSV file format is:
```csv
  ,AMOUNT,ACCOUNT25,TXID,CARDNUMBER,DATEYYYYMMDD,TIMEHHMMSS,STATE,YYYYMM
1,9200,0023822618000299019780009,11664457772,8600000000000000,20180131,12:26:13,0,201801
...
```

## Comparer

`compare.js` file compares receipts from `receipts` by transaction id (rrn).
