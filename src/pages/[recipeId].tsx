import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import {
	setRecipes,
	clearRecipes,
	setAllSavedRecipes,
	addSavedRecipe,
	deleteSavedRecipe,
} from '../store';
import { useSession } from 'next-auth/react';
export default function Recipe() {
	const savedRecipes = useSelector((state: any) => state.savedRecipes);
	const fetchedRecipes = useSelector((state: any) => state.fetchedRecipes);
	const dispatch = useDispatch();
	const router = useRouter();
	const recipeId = router.query.recipeId;
	const { data: session, status } = useSession();
	let recipe1;
	let recipe2;
	if (typeof recipeId === 'string') {
		recipe1 = fetchedRecipes.find(
			(recipe: any) => recipe.id === parseInt(recipeId)
		);
		recipe2 = savedRecipes.find(
			(recipe: any) => recipe.id === parseInt(recipeId)
		);
	}

	const recipe = recipe1 || recipe2;

	function searchIngredients(ingredientList: any, keywords: any) {
		// Convert the ingredient list to lowercase for case-insensitive search
		const lowerCaseIngredientList = ingredientList.toLowerCase();

		// Create a regular expression pattern from the keywords array
		const keywordPattern = new RegExp(keywords.join('|'), 'gi');

		// Check if any matches are found in the ingredient list
		return keywordPattern.test(lowerCaseIngredientList);
	}
	function HTMLRenderer({ htmlString }: any) {
		return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
	}
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
				dispatch(deleteSavedRecipe(recipe.id));
			} else {
				console.error('Failed to add recipe');
			}
		} catch (error) {
			console.error('An error occurred', error);
		}
	}
	if (!recipe) {
		return null; // Or display a loading indicator
	} else
		return (
			<main className='p-4 bg-firstcolor flex justify-center text-gray-200 min-h-screen'>
				<div className='max-w-2xl'>
					<div className='flex justify-between px-8 items-center py-2'>
						<button
							onClick={() => {
								router.back();
							}}
							className='relative transition-transform transform hover:scale-110 flex items-center justify-center'
						>
							<BsFillArrowLeftCircleFill className='h-6 w-6 text-secondcolor bg-gray-200 rounded-full' />
						</button>
						{status === 'authenticated' &&
							savedRecipes !== null &&
							!savedRecipes.find(
								(localItem: any) => localItem.id === recipe.id
							) && (
								<div>
									<button
										className='border rounded-lg bg-gray-200 text-secondcolor p-1 transition-transform transform hover:scale-110'
										onClick={() =>
											saveRecipe(
												recipe,
												session?.user?.email
											)
										}
									>
										Save
									</button>
								</div>
							)}
						{status === 'authenticated' &&
							savedRecipes !== null &&
							savedRecipes.find(
								(localItem: any) => localItem.id === recipe.id
							) && (
								<div>
									<button
										onClick={() => {
											deleteRecipe(
												recipe.id,
												session.user?.email
											);
										}}
										className='border relative rounded-lg bg-gray-200 text-secondcolor p-1 transition-transform transform hover:scale-110 hover:text-red-500 hover:bg-red-200 h-full w-full before:content-["Saved"] hover:before:content-["Delete"]'
									></button>
								</div>
							)}
					</div>

					<div className='flex flex-col items-center gap-6 p-4 bg-secondcolor bg-opacity-50 rounded-lg'>
						<div className='flex flex-col md:flex-row gap-4 items-center'>
							<Image
								src={recipe.image}
								alt=''
								width={350}
								height={350}
								className='rounded-lg'
							/>
							<div className='flex flex-col gap-2'>
								<h1 className='text-center'>{recipe.title}</h1>
								<div className='flex justify-center items-center gap-4'>
									{searchIngredients(recipe.instructions, [
										'chicken',
									]) && (
										<div>
											<Image
												src='/chicken.png'
												width={20}
												height={20}
												alt='chicken'
												className=''
											/>
										</div>
									)}

									{searchIngredients(recipe.instructions, [
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

									{searchIngredients(recipe.instructions, [
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

									{searchIngredients(recipe.instructions, [
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

									{searchIngredients(recipe.instructions, [
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
							</div>
						</div>
						<h1>Ingredients:</h1>
						<div className='flex flex-wrap gap-1'>
							{recipe.extendedIngredients.map(
								(item: any, index: any) => (
									<div key={index}>
										{item.name}
										{index + 1 <
											recipe.extendedIngredients
												.length && <span>,</span>}
									</div>
								)
							)}
						</div>
						<h1>Instructions:</h1>
						{recipe.instructions.includes('>') && (
							<HTMLRenderer htmlString={recipe.instructions} />
						)}
						{!recipe.instructions.includes('>') && (
							<div>{recipe.instructions}</div>
						)}
					</div>
				</div>
			</main>
		);
}
