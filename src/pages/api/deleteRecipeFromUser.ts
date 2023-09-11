import clientPromise from '../../../lib/mongodb';

export default async function handler(req: any, res: any) {
	try {
		const client = await clientPromise;
		const db = client.db('appdb');

		const response = await db.collection('users').updateOne(
			{ email: req.body.userEmail }, // Query to identify the user
			{ $pull: { recipeIds: req.body.recipeId } } // Data to remove from the array
		);

		res.json(response);
	} catch (e) {
		console.error(e);
	}
}
