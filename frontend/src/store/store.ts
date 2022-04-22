import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import translationsReducer from "./translate-piece-reducer";
import textSegmentsReducer from "./text-segment-reducer";

export const store = configureStore({
    reducer: {
        userReducer,
        translationsReducer,
        textSegmentsReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;