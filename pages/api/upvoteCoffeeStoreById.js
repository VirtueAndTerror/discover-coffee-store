import { table, getRecordById, getRecordsFields } from '../../lib/airtable';

const upvoteCoffeeStoreById = async (req, res) => {
  if (req.method !== 'PUT')
    return res.status(405).json({ message: '405 Method Not Allowed' });

  const { id } = req.body;
  try {
    if (!id) return res.status(400).json({ message: 'Id could not be found' });

    const records = await getRecordById(id);

    if (!records.length)
      return res
        .status(404)
        .json({ message: 'coffee store could not be found' });

    const record = records[0];
    const calculateVoting = parseInt(record.votes) + 1;

    // Update in DB
    const updateRecord = await table.update([
      {
        id: record.recordId,
        fields: {
          votes: calculateVoting,
        },
      },
    ]);

    if (updateRecord) {
      const minifiedRecord = getRecordsFields(updateRecord);
      res.json(minifiedRecord);
    }

    // res.json(records);
  } catch (ex) {
    res.status(500).json({ message: 'Error upvoting our coffee store', ex });
  }
};

export default upvoteCoffeeStoreById;
