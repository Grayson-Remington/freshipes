import { useSelector, useDispatch } from 'react-redux';
import { setAllSavedRecipes, deleteSavedRecipe } from '../store';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function Dashboard() {
	const savedRecipes = useSelector((state: any) => state.savedRecipes);
	const dispatch = useDispatch();
	const { data: session, status } = useSession();
	function searchIngredients(ingredientList: any, keywords: any) {
		// Convert the ingredient list to lowercase for case-insensitive search
		const lowerCaseIngredientList = ingredientList.toLowerCase();

		// Create a regular expression pattern from the keywords array
		const keywordPattern = new RegExp(keywords.join('|'), 'gi');

		// Check if any matches are found in the ingredient list
		return keywordPattern.test(lowerCaseIngredientList);
	}
	const setSavedRecipes = async (userEmail: any) => {
		try {
			const userResponse = await fetch('/api/userSavedRecipes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userEmail),
			});

			if (userResponse.ok) {
				const userData = await userResponse.json();
				try {
					const recipesResponse = await fetch('/api/recipes', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body:
							userData.savedRecipes !== null
								? JSON.stringify(userData.recipeIds)
								: JSON.stringify([]),
					});

					if (recipesResponse.ok) {
						const data = await recipesResponse.json();
						dispatch(setAllSavedRecipes(data));
						// Recipe added successfully
					} else {
						console.error('Failed to add recipe');
					}
				} catch (error) {
					console.error('An error occurred', error);
				}
			} else {
				console.error('Failed to add recipe');
			}
		} catch (error) {
			console.error('An error occurred', error);
		}
	};
	useEffect(() => {
		if (status === 'authenticated') {
			setSavedRecipes(session?.user?.email);
		}
	}, [session]);
	async function deleteRecipe(recipeId: any, userEmail: any) {
		try {
			const response = await fetch('/api/deleteRecipeFromUser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ recipeId, userEmail }),
			});

			if (response.ok) {
				dispatch(deleteSavedRecipe(recipeId));
			} else {
				console.error('Failed to add recipe');
			}
		} catch (error) {
			console.error('An error occurred', error);
		}
	}
	return (
		<main className='relative bg-firstcolor min-h-screen'>
			<div className='sticky top-0 grid grid-cols-2 md:grid-cols-3 items-center justify-items-stretch px-4 lg:px-8 lg:h-20 gap-2 py-4 z-50 bg-white w-full'>
				<div className='flex gap-4 h-full items-center underline row-start-1 md:row-start-auto justify-self-start'>
					<Link
						href='/'
						className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center font-extrabold'
					>
						Back
					</Link>
				</div>
				<h1 className='text-firstcolor text-2xl font-extrabold justify-self-center col-span-2 md:hidden'>
					Saved Fresh-ipes
				</h1>
				<h1 className='text-firstcolor text-2xl font-extrabold justify-self-center hidden md:block'>
					Saved Fresh-ipes
				</h1>
				<div className='flex gap-4 h-full items-center underline row-start-1 md:row-start-auto justify-self-end'>
					{status === 'authenticated' && (
						<>
							<button
								onClick={() => signOut({ callbackUrl: '/' })}
								className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center font-extrabold'
							>
								Signout
							</button>
						</>
					)}
				</div>
			</div>
			{savedRecipes !== null ? (
				<div className=' grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 relative '>
					{savedRecipes.map((item: any, index: any) => (
						<div
							key={index}
							className='relative flex flex-col border border-transparent rounded-lg p-2 text-center bg-secondcolor text-gray-200 shadow-[5px_5px_0px_0px_rgba(109,40,217)]'
						>
							<Link
								href={`/${item.id}`}
								as={`/${item.id}`}
								className='flex flex-col justify-between relative border border-transparent rounded-lg text-center bg-secondcolor text-gray-200 h-full'
							>
								<h1>{item.title}</h1>

								<div className='relative flex flex-col gap-2 items-center'>
									<div className='flex justify-center items-center gap-4 bg-gray-200 rounded-lg p-1'>
										{searchIngredients(item.instructions, [
											'chicken',
										]) && (
											<div>
												<Image
													src='/chicken.png'
													width={20}
													height={20}
													alt='chicken'
												/>
											</div>
										)}

										{searchIngredients(item.instructions, [
											'pasta',
											'macaroni',
										]) && (
											<div>
												<Image
													src='/pasta.png'
													width={20}
													height={20}
													alt='chicken'
												/>
											</div>
										)}

										{searchIngredients(item.instructions, [
											'rice',
										]) && (
											<div>
												<Image
													src='/rice.png'
													width={20}
													height={20}
													alt='chicken'
												/>
											</div>
										)}

										{searchIngredients(item.instructions, [
											'cheese',
										]) && (
											<div>
												<Image
													src='/cheese.png'
													width={20}
													height={20}
													alt='chicken'
												/>
											</div>
										)}

										{searchIngredients(item.instructions, [
											'vegetable',
											'mushrooms',
											'potato',
											'pepper',
										]) && (
											<div>
												<Image
													src='/vegetable.png'
													width={20}
													height={20}
													alt='chicken'
												/>
											</div>
										)}
									</div>
									<div className='relative'>
										{item.veryPopular == 'true' && (
											<div className='absolute z-50 flex place-content-center place-items-center h-12 w-12 -left-0 -top-0'>
												<div
													id='burst-12'
													className='absolute'
												></div>
												<div className='absolute text-sm text-center font-serif text-white drop-shadow-[0_2.2px_2.2px_rgba(0,0,0,0.8)]'>
													Popular!
												</div>
											</div>
										)}
										{
											<div className='absolute z-50 flex place-content-center place-items-center -right-0 -top-0'>
												<div className='relative h-6 w-6 md:w-8 md:h-8 '>
													<div
														id='heart'
														className='heart'
													></div>
													<div className='relative -top-6 md:-top-6 text-xs md:text-sm font-serif text-white drop-shadow-[0_2.2px_2.2px_rgba(0,0,0,0.8)]'>
														{item.aggregateLikes}
													</div>
												</div>
											</div>
										}
										<Image
											src={item.image}
											alt=''
											width={400}
											height={400}
											className='rounded-lg'
										/>
									</div>
								</div>
							</Link>
							{status === 'authenticated' &&
								savedRecipes !== null &&
								savedRecipes.find(
									(localItem: any) => localItem.id === item.id
								) && (
									<div>
										<button
											onClick={() =>
												deleteRecipe(
													item.id,
													session?.user?.email
												)
											}
										>
											Delete
										</button>
									</div>
								)}
						</div>
					))}
				</div>
			) : (
				<div>No</div>
			)}
		</main>
	);
}
