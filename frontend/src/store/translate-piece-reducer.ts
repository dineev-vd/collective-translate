import { GetTranslationDto, PostTranslationDto } from "@common/dto/translate-piece.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface TranslationState {
    id: number;
    translationText: string;
    order: number;
}

interface TranslationsState {
    translations: { [key: string]: TranslationState[] },
    changes: { [key: string]: PostTranslationDto }
}

const initialState: TranslationsState = {
    translations: {},
    changes: {}
}

export const translationsSlice = createSlice({
    name: 'translations',
    initialState,
    reducers: {
        prependTranslations: (state, action: PayloadAction<{ translations: TranslationState[], language: string }>) => {
            state.translations[action.payload.language] = [...action.payload.translations, ...state.translations[action.payload.language]]
        },
        appendTranslations: (state, action: PayloadAction<{ translations: TranslationState[], language: string }>) => {
            state.translations[action.payload.language] = [...(state.translations[action.payload.language] ?? []), ...action.payload.translations]
        },
        putTranslations: (state, action: PayloadAction<{ translations: TranslationState[], language: string }>) => {
            const translations = action.payload.translations;
            const language = action.payload.language;

            if (state.translations[language] && state.translations[language].length > 0) {

                const final = [...translations, ...state.translations[language]].filter((v, i, a) => a.findIndex(c => c.order === v.order) === i).sort((a, b) => a.order - b.order);

                if (final[0].order == state.translations[language][0].order && final.length > 300) {
                    state.translations[language] = final.slice(100, final.length);
                    return;
                }

                if (final[final.length - 1].order == state.translations[language][state.translations[language].length - 1].order && final.length > 300) {
                    state.translations[language] = final.slice(0, final.length - 100);
                    return;
                }

                state.translations[language] = final;

                // if (translations.length === 0)
                //     return;

                // if(translations.length > state.translations[language].length) {
                //     state.translations[language] = translations;
                //     return;
                // }

                // const length = state.translations[language].length;
                // if (translations[0].order > state.translations[language][length - 1].order + 1)
                //     return;

                // if (translations[translations.length - 1].order < state.translations[language][0].order - 1)
                //     return;

                // if (translations[0].order === state.translations[language][length - 1].order + 1) {
                //     state.translations[language] = [...state.translations[language], ...translations];
                //     return;
                // }

                // if (translations[translations.length - 1].order === state.translations[language][0].order - 1) {
                //     state.translations[language] = [...translations, ...state.translations[language]];
                //     return;
                // }

                // const right = state.translations[language].findIndex(t => t.order === translations[translations.length - 1].order);
                // const left = state.translations[language].findIndex(t => t.order === translations[0].order);
                // state.translations[language] = [
                //     ...state.translations[language].slice(0, left),
                //     ...translations,
                //     ...state.translations[language].slice(right + 1, length)
                // ]

                return;
            }

            state.translations[language] = translations;
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

export const { putTranslations, prependTranslations, appendTranslations, clearTranslations, putTranslationChanges } = translationsSlice.actions;

export default translationsSlice.reducer;