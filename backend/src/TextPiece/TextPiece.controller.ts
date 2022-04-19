import { GetTextPieceDto, PostTextPieceDto } from 'common/dto/text-piece.dto';
import { PROJECT_ENDPOINT, TEXT_PIECES_ENDPOINT } from 'common/constants';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TextpieceService } from './TextPiece.service';

@Controller([PROJECT_ENDPOINT, ':projectId', TEXT_PIECES_ENDPOINT].join('/'))
export class TextpieceController {
    constructor(
        private readonly textpieceService: TextpieceService
    ) { }

    @Get(':id')
    async getTextPieceById(@Param('projectId') projectId: string, @Query('ids') sequenceNumbersString: string) {
        return this.textpieceService.getPiece(projectId, sequenceNumbersString.split(','))
    }

    @Post(':id')
    async postTextPieceById(@Body() pieces: PostTextPieceDto[]) {
        return this.textpieceService.savePieces(pieces);
    }
}
