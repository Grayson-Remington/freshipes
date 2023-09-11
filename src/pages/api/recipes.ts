import clientPromise from '../../../lib/mongodb';

export default async function handler(req: any, res: any) {
	try {
		const client = await clientPromise;
		const db = client.db('appdb');

		const recipes = await db
			.collection('recipes')
			.find({ id: { $in: req.body } })
			.toArray();

		res.status(200).json(recipes);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Internal server error' });
	}
}
