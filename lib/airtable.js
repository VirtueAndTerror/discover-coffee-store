const Airtable = require('airtable');
const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

// Initialize Aritable API
const base = new Airtable({ apiKey }).base(baseId);

const table = base('coffee-stores');

const getRecordsFields = records => {
  return records.map(record => ({ recordId: record.id, ...record.fields }));
};

const getRecordById = async id => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getRecordsFields(findCoffeeStoreRecords);
};

export { table, getRecordsFields, getRecordById };
