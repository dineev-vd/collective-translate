import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import Project from './entities/Project.entity';
import TranslatePiece from './entities/TranslatePiece.entity';
import User from './entities/User.entity';
import { PieceModule } from './translate-piece/piece.module';
import { TextPiece } from 'entities/TextPiece.entity';
import { TextpieceModule } from './TextPiece/TextPiece.module';
import { AuthModule } from './auth/auth.module';

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
        TranslatePiece,
        User,
        TextPiece
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
