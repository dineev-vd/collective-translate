import { Module } from '@nestjs/common';
import { ProjectModule } from './modules/project/project.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from './entities/project.entity';
import SegmentTranslation from './entities/segment-translation.entity';
import User from './entities/user.entity';
import { TranslationModule } from './modules/translation/translation.module';
import { AuthModule } from './modules/auth/auth.module';
import { Action } from 'entities/action.entity';
import { File } from 'entities/file.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { LanguageModule } from './modules/language/language.module';
import { ActionsModule } from './modules/actions/actions.module';
import { FilesModule } from './modules/files/files.module';
import { Comment } from 'entities/comment.entity';
import { CommentModule } from './modules/comment/comment.module';
import { Assembly } from 'entities/assembly.entity';
import { AssemblyModule } from './modules/assembly/assembly.module';
import { RegularExpression } from 'entities/regexp.entity';
import { RegexpModule } from './modules/regexp/regexp.module';
import { Suggestion } from 'entities/suggestion.entity';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      logging: ['warn'],
      maxQueryExecutionTime: 1000,
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
        Action,
        File,
        Comment,
        TranslationLanguage,
        Assembly,
        RegularExpression,
        Suggestion,
      ],
    }),
    ProjectModule,
    UserModule,
    TranslationModule,
    AuthModule,
    LanguageModule,
    ActionsModule,
    FilesModule,
    CommentModule,
    AssemblyModule,
    RegexpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
