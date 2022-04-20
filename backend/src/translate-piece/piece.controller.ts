import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { PieceService } from "./piece.service";
import SegmentTranslation from "entities/segment-translation.entity";
import { PostTranslatePieceDto } from "common/dto/translate-piece.dto";
import { TRANSLATE_PIECES_ENDPOINT } from "common/constants";
import { JwtAuthGuard } from "guards/simple-guards.guard";
import { ExtendedRequest } from "util/ExtendedRequest";

@Controller(TRANSLATE_PIECES_ENDPOINT)
export class PiecesController {
    constructor(private readonly translationsService: PieceService) { }

    @Get(':id')
    async getPieceById(@Param('id') id: string): Promise<SegmentTranslation> {
        return this.translationsService.getPiece(id);
    }

    @Get('/')
    async getPieceByLanguage(@Query('languageId') languageId: string, @Query('ids') idsString: string): Promise<SegmentTranslation[]> {
        if (languageId) {
            return this.translationsService.getTranslationsByLanguage(languageId);
        }

        if (idsString) {
            const ids = idsString.split(',');
            return this.translationsService.getPieces(ids);
        }
    }

    // @Post('/')
    // async updatePieces(@Body() pieces: Partial<PostTranslatePieceDto>[], @Query('id') id: string) {
    //     await this.translationsService.updatePieces(id, pieces)
    // }

    // @UseGuards(JwtAuthGuard)
    // @Post(':id')
    // async updatePiece(@Request() { user }: ExtendedRequest, @Body() piece: PostTranslatePieceDto, @Param('id') id: string) {
    //     await this.translationsService.updatePiece(id, user, piece)
    //     return this.translationsService.getPiece(id);
    // }
}