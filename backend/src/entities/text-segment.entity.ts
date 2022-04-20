import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { File } from "./file.entity";
import Project from "./project.entity";
import SegmentTranslation from "./segment-translation.entity";

@Entity()
export class TextSegment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project)
    project: Project;

    @OneToOne(() => TextSegment, {nullable: true})
    @JoinColumn()
    previous?: TextSegment;

    @OneToOne(() => TextSegment, {nullable: true})
    @JoinColumn()
    next?: TextSegment;

    @Column()
    text: string;
    
    @OneToMany(() => SegmentTranslation, (piece) => piece.textSegment)
    translations: SegmentTranslation[];

    @RelationId((piece: TextSegment) => piece.translations)
    translationIds: string[];

    @ManyToOne(() => File, file => file.textSegments)
    file: File;

    @Column()
    shouldTranslate: Boolean
}