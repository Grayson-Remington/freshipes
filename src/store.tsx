import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

export const recipesSlice = createSlice({
	name: 'recipes',
	initialState: {
		fetchedRecipes: [],
		savedRecipes: [],
	} as any,
	reducers: {
		setRecipes: (state, action) => {
			state.fetchedRecipes = action.payload;
		},
		clearRecipes: (state) => {
			state.fetchedRecipes = [];
		},
		setAllSavedRecipes: (state, action) => {
			state.savedRecipes = action.payload;
		},
		addSavedRecipe: (state, action) => {
			const existingRecipeIndex = state.savedRecipes.findIndex(
				(item: any) => item.id === action.payload.id
			);

			if (existingRecipeIndex === -1) {
				state.savedRecipes.push(action.payload);
			} else {
				state.savedRecipes[existingRecipeIndex] = action.payload;
			}
		},
		deleteSavedRecipe: (state, action) => {
			state.savedRecipes = state.savedRecipes.filter(
				(item: any) => item.id !== action.payload
			);
		},
	},
});

export const {
	setRecipes,
	clearRecipes,
	addSavedRecipe,
	setAllSavedRecipes,
	deleteSavedRecipe,
} = recipesSlice.actions;

export const store = configureStore({
	reducer: recipesSlice.reducer,
});
