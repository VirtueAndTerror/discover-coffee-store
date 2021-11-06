import { getRecordById } from '../../lib/airtable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) return res.status(400).json({ message: 'Id could not be found' });

    const records = await getRecordById(id);

    if (!records.length)
      return res.status(404).json({ message: 'id could not be found' });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'something went worng', error });
  }
};

export default getCoffeeStoreById;
