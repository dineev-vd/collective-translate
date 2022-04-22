import { GetTranslationDto, PostTranslationDto } from "@common/dto/translate-piece.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface TranslationState {
    id: number;
    textSegmentId: number;
    translationText: string;
}

interface TranslationsState {
    translations: { [key: number]: TranslationState },
    changes: { [key: number]: PostTranslationDto }
}

const initialState: TranslationsState = {
    translations: {},
    changes: {}
}

export const translationsSlice = createSlice({
    name: 'translations',
    initialState,
    reducers: {
        putTranslations: (state, action: PayloadAction<{ translation: TranslationState, id: number }[]>) => {
            action.payload.forEach(piece => {
                state.translations[piece.id] = piece.translation;
            })
        },
        clearTranslations: (state) => {
            state.translations = {};
        },
        putTranslationChanges: (state, action: PayloadAction<{ translation: PostTranslationDto, id: number }[]>) => {
            action.payload.forEach(piece => {
                state.changes[piece.id] = piece.translation;
            })
        }
    }
})

export const selectTranslations = (state: RootState) => state.translationsReducer.translations;
export const selectTranslationChanges = (state: RootState) => state.translationsReducer.changes;

export const { putTranslations, clearTranslations, putTranslationChanges } = translationsSlice.actions;

export default translationsSlice.reducer;