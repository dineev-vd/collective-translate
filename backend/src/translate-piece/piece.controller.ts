import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { PieceService } from "./piece.service";
import TranslatePiece from "entities/TranslatePiece.entity";
import { PostTranslatePieceDto } from "common/dto/translate-piece.dto";
import { TRANSLATE_PIECES_ENDPOINT } from "common/constants";
import { JwtAuthGuard } from "guards/simple-guards.guard";
import { ExtendedRequest } from "util/ExtendedRequest";

@Controller(TRANSLATE_PIECES_ENDPOINT)
export class PiecesController {
    constructor(private readonly pieceService: PieceService) { }

    @Get(':id')
    async getPieceById(@Param('id') id: string): Promise<TranslatePiece> {
        return this.pieceService.getPiece(id);
    }

    @Get('/')
    async getPieceByProject(@Query('projectId') projectId: string, @Query('ids') idsString: string): Promise<TranslatePiece[]> {
        if (projectId) {
            return this.pieceService.getPiecesByProject(projectId);
        }

        if (idsString) {
            const ids = idsString.split(',');
            return this.pieceService.getPieces(ids);
        }
    }

    @Post('/')
    async updatePieces(@Body() pieces: Partial<PostTranslatePieceDto>[], @Query('id') id: string) {
        await this.pieceService.updatePieces(id, pieces)
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    async updatePiece(@Request() { user }: ExtendedRequest, @Body() piece: PostTranslatePieceDto, @Param('id') id: string) {
        await this.pieceService.updatePiece(id, user, piece)
        return this.pieceService.getPiece(id);
    }
}