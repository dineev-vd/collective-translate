import { GetTextPieceDto, PostTextPieceDto } from 'common/dto/text-piece.dto';
import { PROJECT_ENDPOINT, TEXT_PIECES_ENDPOINT } from 'common/constants';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TextpieceService } from './TextPiece.service';

@Controller([TEXT_PIECES_ENDPOINT].join('/'))
export class TextpieceController {
    constructor(
        private readonly textpieceService: TextpieceService
    ) { }

    @Get(':id')
    async getTextPieceById(@Param('id') id: string) {
        return this.textpieceService.getPiece(id)
    }

    @Post(':id')
    async postTextPieceById(@Body() pieces: PostTextPieceDto[]) {
        return this.textpieceService.savePieces(pieces);
    }
}
