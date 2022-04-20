import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import Project from './entities/project.entity';
import SegmentTranslation from './entities/segment-translation.entity';
import User from './entities/user.entity';
import { PieceModule } from './translate-piece/piece.module';
import { TextSegment } from 'entities/text-segment.entity';
import { TextpieceModule } from './TextPiece/TextPiece.module';
import { AuthModule } from './auth/auth.module';
import { Action } from 'entities/action.entity';
import { File } from 'entities/file.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: +(POSTGRES_PORT ?? 5432),
      database: POSTGRES_DB,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      dropSchema: true,
      synchronize: true,
      entities: [
        Project,
        SegmentTranslation,
        User,
        TextSegment,
        Action,
        File,
        TranslationLanguage
      ]
    }),
    ProjectModule,
    UserModule,
    PieceModule,
    TextpieceModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { 

}
