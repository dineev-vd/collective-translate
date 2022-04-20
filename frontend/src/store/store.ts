import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import translatePieceReducer from "./translatePieceReducer";
import textPieceReducer from "./textPieceReducer";

export const store = configureStore({
    reducer: {
        userReducer,
        translatePieceReducer,
        textPieceReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;