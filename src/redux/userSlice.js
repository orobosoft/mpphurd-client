import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  currentUser: null,
  loading: false,
  error: false
}

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginStart: (state) => {
			state.loading = true;
		},
		loginSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
		},
		loginFailure: (state) => {
			state.currentUser = null;
			state.loading = false;
			state.error = true;
		},
		logout: (state) => {
			state.currentUser = null;
			state.loading = false;
			state.error = false;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(PURGE, (state) => {
			customEntityAdapter.removeAll(state);
		});
	},
});

export const {loginStart,loginSuccess,loginFailure,logout} = userSlice.actions
export default userSlice.reducer