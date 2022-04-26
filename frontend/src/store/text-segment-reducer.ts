import { GetTextSegmentDto, PostTextSegmentDto } from "@common/dto/text-piece.dto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface TextSegmentState {
    id: number;
    text: string;
    order: number;
    shouldTranslate: Boolean;
    translationIds: { [key: number]: number };
}

export interface TextSegment {
    textSegments: { [key: number]: TextSegmentState },
    changes: { [key: string]: PostTextSegmentDto }
}

const initialState: TextSegment = {
    textSegments: {},
    changes: {}
}

export const textSegmentSlice = createSlice({
    name: 'textPiece',
    initialState,
    reducers: {
        putTextSegments: (state, action: PayloadAction<TextSegmentState[]>) => {
            action.payload.forEach(segment => {
                state.textSegments[segment.id] = segment;
            })
        },
        clearTextSegments: (state) => {
            state.textSegments = [];
        },
        putTextChanges: (state, action: PayloadAction<{ textSegment: PostTextSegmentDto, id: number }[]>) => {
            action.payload.forEach(piece => {
                state.changes[piece.id] = piece.textSegment;
            })
        },
        addTranslations: (state, action: PayloadAction<{ textSegmentId: number, languageId: number, translationId: number }[]>) => {
            action.payload.forEach(info => {
                //console.log(info.textSegmentId)
                state.textSegments[info.textSegmentId].translationIds[info.languageId] = info.translationId;
            })
        }
    }
})

export const selectTextSegments = (state: RootState) => state.textSegmentsReducer.textSegments;
export const selectTextChanges = (state: RootState) => state.textSegmentsReducer.changes;

export const { putTextSegments, clearTextSegments, putTextChanges, addTranslations } = textSegmentSlice.actions;

export default textSegmentSlice.reducer;