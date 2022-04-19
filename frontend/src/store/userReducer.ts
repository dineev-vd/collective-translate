import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetUserDto } from "common/dto/user.dto";
import { RootState } from "./store";

interface UserState {
    user: GetUserDto;
}

const initialState: UserState = {
    user: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        },
        setUser: (state, action: PayloadAction<GetUserDto>) => {
            state.user = action.payload;
        }
    }
})

export const selectUser = (state: RootState) => state.userReducer.user;

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;