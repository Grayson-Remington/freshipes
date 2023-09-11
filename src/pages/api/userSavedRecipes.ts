import clientPromise from '../../../lib/mongodb';

export default async function handler(req: any, res: any) {
	try {
		const client = await clientPromise;
		const db = client.db('appdb');

		const response = await db
			.collection('users')
			.findOne({ email: req.body });
		res.json(response);
	} catch (e) {
		console.error(e);
	}
}
