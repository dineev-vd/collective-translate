import { Language } from "common/enums";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";
import Project from "./project.entity";
import { TextSegment } from "./text-segment.entity";
import { Action } from "./action.entity";
import { TranslationLanguage } from "./translation-language.entity";

@Entity()
class SegmentTranslation {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TextSegment, (piece) => piece.translations, { cascade: true })
    textSegment: TextSegment;

    @RelationId((piece: SegmentTranslation) => piece.textSegment)
    textSegmentId: number;

    @Column({ default: "" })
    translationText: string;

    @OneToMany(() => Action, action => action.segment)
    actions: Action[];

    @ManyToOne(() => TranslationLanguage, language => language.translationSegments)
    translationLanguage: TranslationLanguage;

}

export default SegmentTranslation;