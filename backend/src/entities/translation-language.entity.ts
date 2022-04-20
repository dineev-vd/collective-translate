import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Language } from "common/enums";
import SegmentTranslation from "./segment-translation.entity";
import Project from "./project.entity";

@Entity()
export class TranslationLanguage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: Language,
    })
    language: Language;

    @OneToMany(() => SegmentTranslation, segment => segment.translationLanguage)
    translationSegments: SegmentTranslation[];

    @ManyToOne(() => Project)
    project: Project;
}