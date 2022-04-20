import { GetTextPieceDto } from "@common/dto/text-piece.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface TextPiece {
    textPieces: { [key: string]: GetTextPieceDto }
}

const initialState: TextPiece = {
    textPieces: {}
}

export const textPieceSlice = createSlice({
    name: 'textPiece',
    initialState,
    reducers: {
        putTextPieces: (state, action: PayloadAction<GetTextPieceDto[]>) => {
            action.payload.forEach(piece => {
                state.textPieces[piece.id] = piece;
            })
        },
        clearTextPieces: (state) => {
            state.textPieces = {};
        }
    }
})

export const selectTextPieces = (state: RootState) => state.textPieceReducer.textPieces;

export const { putTextPieces, clearTextPieces } = textPieceSlice.actions;

export default textPieceSlice.reducer;