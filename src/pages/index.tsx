import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import {
	setRecipes,
	clearRecipes,
	setAllSavedRecipes,
	addSavedRecipe,
	deleteSavedRecipe,
} from '../store';
import localRecipes from '../localRecipes.js';
import { useSession, signOut } from 'next-auth/react';

import { Checkbox } from 'pretty-checkbox-react';
import 'material-icons/iconfont/material-icons.css';
import '@djthoms/pretty-checkbox';
export default function Home() {
	useEffect(() => {
		const init = async () => {
			const { Ripple, initTE } = await import('tw-elements');
			initTE({ Ripple });
		};
		init();
	}, []);
	const recipes = useSelector((state: any) => state.fetchedRecipes);
	const savedRecipes = useSelector((state: any) => state.savedRecipes);
	const dispatch = useDispatch();

	const [search, setSearch] = useState('');
	const [searchSuccess, setSearchSuccess] = useState(false);
	const { data: session, status } = useSession();

	const options = {
		method: 'GET',
		url: process.env.NEXT_PUBLIC_RECIPE_API_URL,
		params: {
			tags: search,
			number: '12',
		},
		headers: {
			'X-api-key': process.env.NEXT_PUBLIC_RECIPE_API_KEY,
		},
	};
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

	// const fetchData = (event) => {
	// 	event?.preventDefault();
	// 	dispatch(setRecipes(localRecipes));
	// };
	const fetchData = (event: any) => {
		event.preventDefault();
		axios
			.request(options)
			.then((response) => {
				dispatch(setRecipes(response.data.recipes));
				console.log(response.data.recipes);
				setSearchSuccess(true);
			})
			.catch((error) => {
				console.error('Error fetching data:', error);
				setSearchSuccess(false);
			});
	};

	function searchIngredients(ingredientList: any, keywords: any) {
		// Convert the ingredient list to lowercase for case-insensitive search
		const lowerCaseIngredientList = ingredientList.toLowerCase();

		// Create a regular expression pattern from the keywords array
		const keywordPattern = new RegExp(keywords.join('|'), 'gi');

		// Check if any matches are found in the ingredient list
		return keywordPattern.test(lowerCaseIngredientList);
	}

	const handleClearRecipes = () => {
		dispatch(clearRecipes());
	};

	async function saveRecipe(recipe: any, userEmail: any) {
		try {
			const response = await fetch('/api/addUserSavedRecipe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ recipe, userEmail }),
			});

			if (response.ok) {
				try {
					const response = await fetch('/api/addRecipe', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(recipe),
					});

					if (response.ok) {
						dispatch(addSavedRecipe(recipe));
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
	}
	async function deleteRecipe(recipe: any, userEmail: any) {
		try {
			const response = await fetch('/api/deleteRecipeFromUser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ recipe, userEmail }),
			});

			if (response.ok) {
				dispatch(deleteSavedRecipe(recipe));
			} else {
				console.error('Failed to add recipe');
			}
		} catch (error) {
			console.error('An error occurred', error);
		}
	}
	return (
		<main className='relative  min-h-screen bg-firstcolor'>
			<div className='sticky top-0 grid grid-cols-1 lg:grid-cols-3 items-center justify-items-stretch px-4 lg:px-8 lg:h-20 gap-2 py-4 z-50 bg-white w-full'>
				<h1 className='text-firstcolor text-2xl font-extrabold justify-self-center lg:justify-self-start'>
					Fresh-ipes
				</h1>
				<div className='w-3/4 max-w-[400px] justify-self-center row-start-3 lg:row-start-auto'>
					<form
						onSubmit={fetchData}
						className='relative flex w-full flex-wrap items-stretch'
					>
						<input
							onChange={(e) =>
								setSearch(e.target.value.toLowerCase())
							}
							type='search'
							className='relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary'
							placeholder='Search using ingredients'
							aria-label='Search'
							aria-describedby='button-addon1'
						/>

						<button
							className='relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg'
							type='submit'
							id='button-addon1'
							data-te-ripple-init
							data-te-ripple-color='light'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='h-5 w-5'
							>
								<path
									fillRule='evenodd'
									d='M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z'
									clipRule='evenodd'
								/>
							</svg>
						</button>
					</form>
				</div>
				<div className='flex gap-4 h-full items-center underline lg:justify-self-end justify-self-center'>
					{status === 'authenticated' && (
						<>
							<Link
								href='/dashboard'
								className='transition-transform transform hover:scale-110 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center text-firstcolor font-extrabold'
							>
								Saved Fresh-ipes
							</Link>
							<button
								onClick={() => signOut({ callbackUrl: '/' })}
								className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center font-extrabold'
							>
								Signout
							</button>
						</>
					)}
					{status === 'unauthenticated' && (
						<>
							<Link
								href='/api/auth/signin'
								className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center font-extrabold'
							>
								Sign In
							</Link>
							<Link
								href='/signup'
								className='transition-transform transform hover:scale-105 hover:bg-gray-100 rounded-lg p-1 h-full flex items-center text-center font-extrabold'
							>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
			{recipes !== null && searchSuccess ? (
				<div>
					{recipes.length > 0 ? (
						<div className='grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-firstcolor relative'>
							{recipes.map((item: any, index: number) => (
								<div
									key={index}
									className='shadow-[5px_5px_0px_0px_rgba(109,40,217)] flex flex-col justify-between relative border border-transparent rounded-lg p-2 text-center bg-secondcolor text-gray-200'
								>
									<Link
										href={`/${item.id}`}
										as={`/${item.id}`}
										className='flex flex-col justify-between relative border border-transparent rounded-lg text-center bg-secondcolor text-gray-200 h-full'
									>
										<h1>{item.title}</h1>

										<div className='relative flex flex-col gap-2 items-center'>
											<div className='flex justify-center items-center gap-4 bg-gray-200 rounded-lg p-1'>
												{searchIngredients(
													item.instructions,
													['chicken']
												) && (
													<div>
														<Image
															src='/chicken.png'
															width={20}
															height={20}
															alt='chicken'
														/>
													</div>
												)}

												{searchIngredients(
													item.instructions,
													['pasta', 'macaroni']
												) && (
													<div>
														<Image
															src='/pasta.png'
															width={20}
															height={20}
															alt='chicken'
														/>
													</div>
												)}

												{searchIngredients(
													item.instructions,
													['rice']
												) && (
													<div>
														<Image
															src='/rice.png'
															width={20}
															height={20}
															alt='chicken'
														/>
													</div>
												)}

												{searchIngredients(
													item.instructions,
													['cheese']
												) && (
													<div>
														<Image
															src='/cheese.png'
															width={20}
															height={20}
															alt='chicken'
														/>
													</div>
												)}

												{searchIngredients(
													item.instructions,
													[
														'vegetable',
														'mushrooms',
														'potato',
														'pepper',
													]
												) && (
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
												{item.veryPopular === true && (
													<div className='absolute z-10 flex place-content-center place-items-center h-12 w-12 -left-0 -top-0'>
														<div
															id='burst-12'
															className='absolute'
														></div>
														<div className='absolute text-sm text-center font-serif text-black drop-shadow-[0_2.2px_2.2px_rgba(0,0,0,0.8)]'>
															Popular!
														</div>
													</div>
												)}
												{
													<div className='absolute z-10 flex place-content-center place-items-center -right-0 -top-0'>
														<div className='relative h-6 w-6 md:w-8 md:h-8 '>
															<div
																id='heart'
																className='heart'
															></div>
															<div className='relative -top-6 md:-top-6 text-xs md:text-sm font-serif text-white drop-shadow-[0_2.2px_2.2px_rgba(0,0,0,0.8)]'>
																{
																	item.aggregateLikes
																}
															</div>
														</div>
													</div>
												}
												{item.image ? (
													<Image
														src={item.image}
														alt=''
														width={400}
														height={400}
														className='rounded-lg'
													/>
												) : (
													<Image
														src='/no_image_available4.jpg'
														alt=''
														width={400}
														height={400}
														className='rounded-lg'
													/>
												)}
											</div>
										</div>
									</Link>

									{status === 'authenticated' &&
										savedRecipes !== null &&
										!savedRecipes.find(
											(localItem: any) =>
												localItem.id === item.id
										) && (
											<div>
												<Checkbox
													animation='pulse'
													onClick={() =>
														saveRecipe(
															item,
															session?.user?.email
														)
													}
												>
													Save
												</Checkbox>
											</div>
										)}
								</div>
							))}
						</div>
					) : (
						<div className='text-white flex items-center justify-center p-8 text-3xl'>
							No recipes found for this search
						</div>
					)}
				</div>
			) : (
				<div className='text-white flex items-center justify-center p-8 text-3xl'>
					Search using ingredients
				</div>
			)}
		</main>
	);
}
