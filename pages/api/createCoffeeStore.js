import { table, getRecordsFields, getRecordById } from '../../lib/airtable';

// TODO:  Implement State Mangement Hooks for this.

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    //   find a record
    const { id, name, neighborhood, address, imgUrl, votes } = req.body;

    try {
      if (id) {
        const records = await getRecordById(id);

        if (records.length) {
          res.json(records);
        } else {
          // create a record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  votes,
                  imgUrl,
                },
              },
            ]);

            const records = getRecordsFields(createRecords);

            res.status(201);
            res.json({ message: records });
          } else {
            res.status(400);
            res.json({
              message: 'The id or name field(s) has not been provided',
            });
          }
        }
      }
    } catch (error) {
      const errorMsg = 'Error while creating or finding a store';
      console.error(errorMsg, error);
      res.status(500);
      res.json({ message: errorMsg });
    }
  } else {
    res.status(405);
    res.json({ message: '405 Method Not Allowed' });
  }
};

export default createCoffeeStore;
