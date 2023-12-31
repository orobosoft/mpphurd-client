import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
	currentAdmin: null,
	loading: null,
	error: null,
};

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		adminLoginStart: (state) => {
			state.loading = true;
			state.error = null;
			state.currentAdmin = null;
		},
		adminLoginSuccess: (state, action) => {
			state.currentAdmin = action.payload;
			state.loading = null;
			state.error = null;
		},
		adminLoginFailure: (state) => {
			state.currentAdmin = null;
			state.loading = null;
			state.error = true;
		},
		adminLogout: (state) => {
			state.currentAdmin = null;
			state.loading = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(PURGE, (state) => {
			return initialState;
		});
	},
});

export const { adminLoginStart, adminLoginSuccess, adminLoginFailure, adminLogout } =
	adminSlice.actions;
export default adminSlice.reducer;
