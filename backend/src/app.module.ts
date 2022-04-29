import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from './entities/project.entity';
import SegmentTranslation from './entities/segment-translation.entity';
import User from './entities/user.entity';
import { TranslationModule } from './translation/translation.module';
import { AuthModule } from './auth/auth.module';
import { Action } from 'entities/action.entity';
import { File } from 'entities/file.entity';
import { TranslationLanguage } from 'entities/translation-language.entity';
import { LanguageModule } from './language/language.module';
import { ActionsModule } from './actions/actions.module';
import { FilesModule } from './files/files.module';
import { Comment } from 'entities/comment.entity';
import { CommentModule } from './comment/comment.module';
import { Assembly } from 'entities/assembly.entity';
import { AssemblyModule } from './assembly/assembly.module';
import { RegularExpression } from 'entities/regexp.entity';
import { RegexpModule } from './regexp/regexp.module';

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
        RegularExpression
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
