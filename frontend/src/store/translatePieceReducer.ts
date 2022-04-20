import { GetTranslatePieceDto } from "@common/dto/translate-piece.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface TranslatePieceState {
    translatePieces: { [key: string]: GetTranslatePieceDto },
}

const initialState: TranslatePieceState = {
    translatePieces: {},
}

export const translatePieceSlice = createSlice({
    name: 'translatePiece',
    initialState,
    reducers: {
        putTranslatePieces: (state, action: PayloadAction<GetTranslatePieceDto[]>) => {
            action.payload.forEach(piece => {
                state.translatePieces[piece.id] = piece;
            })
        },
        clearTranslatePieces: (state) => {
            state.translatePieces = {};
        },
        changeTranslatePiece: (state, action: PayloadAction<{ id: string, after?: string, before?: string }>) => {
            if (action.payload.after)
                state.translatePieces[action.payload.id].after = action.payload.after;

            if (action.payload.before)
                state.translatePieces[action.payload.id].before = action.payload.before;
        }
    }
})

export const selectTranslatePieces = (state: RootState) => state.translatePieceReducer.translatePieces;

export const { putTranslatePieces, clearTranslatePieces, changeTranslatePiece } = translatePieceSlice.actions;

export default translatePieceSlice.reducer;