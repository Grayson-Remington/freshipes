import clientPromise from '../../../lib/mongodb';

export default async function handler(req: any, res: any) {
	try {
		const client = await clientPromise;
		const db = client.db('appdb');

		const response = await db.collection('recipes').updateOne(
			{ name: req.body.id }, // Query for finding an existing item with the same name
			{ $setOnInsert: req.body }, // Data to insert if no matching document is found
			{ upsert: true } // If no matching document found, insert the data
		);
		res.json(response);
	} catch (e) {
		console.error(e);
	}
}
