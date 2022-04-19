import { Body, Controller, Get, HttpCode, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { PieceService } from "./piece.service";
import TranslatePiece from "entities/TranslatePiece.entity";
import { GetTranslatePieceDto } from "common/dto/translate-piece.dto";
import { TRANSLATE_PIECES_ENDPOINT } from "common/constants";

@Controller(TRANSLATE_PIECES_ENDPOINT)
export class PiecesController {
    constructor(private readonly pieceService: PieceService) { }

    @Get(':id')
    async getPieceById(@Param('id') projectId: string, @Query('piece') id: string): Promise<TranslatePiece> {
        return this.pieceService.getPiece(id, projectId);
    }

    @Get('/')
    async getPieceByProject(@Query('projectId') projectId: string): Promise<TranslatePiece[]> {
        return this.pieceService.getPiecesByProject(projectId);
    }

    @Post('/')
    async updatePiece(@Body() pieces: Partial<GetTranslatePieceDto>[], @Query('id') id: string) {
        await this.pieceService.updatePiece(id, pieces)
    }
}