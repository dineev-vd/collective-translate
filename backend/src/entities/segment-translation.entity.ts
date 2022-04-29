import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { File } from './file.entity';
import { TranslationLanguage } from './translation-language.entity';

@Entity()
class SegmentTranslation {
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  translationText?: string;

  @ManyToOne(
    () => TranslationLanguage,
    (language) => language.translationSegments,
  )
  translationLanguage: TranslationLanguage;

  @RelationId((segment: SegmentTranslation) => segment.translationLanguage)
  translationLanguageId: number;

  @ManyToOne(
    () => File,
    (file) => file.textSegments
  )
  file: File;

  @RelationId((segment: SegmentTranslation) => segment.file)
  fileId: number;

  @Column()
  order: number;

  @Column()
  shouldTranslate: Boolean;
}

export default SegmentTranslation;
