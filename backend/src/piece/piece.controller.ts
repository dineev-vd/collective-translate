import { Body, Controller, Get, HttpCode, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import Project from "@entities/Project.entity";
import { PieceService } from "./piece.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import TranslatePiece from "@entities/TranslatePiece.entity";
import { PostTranslatePieceDto } from "@common/dto/post-translate-piece.dto";

@Controller('piece')
export class PiecesController {
    constructor(private readonly pieceService: PieceService) { }

    @Get(':id')
    async getPieceById(@Param('id') id: string): Promise<TranslatePiece> {
        return this.pieceService.getPiece(id);
    }

    @Get('/')
    async getPieceByProject(@Query('projectId') projectId: string): Promise<TranslatePiece[]> {
        return this.pieceService.getPiecesByProject(projectId);
    }

    @Post(':id')
    async updatePiece(@Body() piece: PostTranslatePieceDto, @Param('id') id: string) {
        await this.pieceService.updatePiece(id, piece)
    }
}