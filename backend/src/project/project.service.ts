import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Project from "entities/project.entity";
import { ILike, Repository } from "typeorm";
import SegmentTranslation from "entities/segment-translation.entity";
import * as fs from "fs/promises";
import * as iconv from "iconv-lite";
import { TextSegment } from "entities/text-segment.entity";
import { TextpieceService } from "TextPiece/TextPiece.service";
import { PostProjectDto, GetProjectDto } from "common/dto/project.dto";
import { File } from "entities/file.entity";

@Injectable()
export class ProjectService implements OnApplicationBootstrap {
    async onApplicationBootstrap() {
        const reg = /(\s+[^.!?]*[.!?])/g;
        let testString = "";
        const data = await fs.readFile("../test.txt");
        testString = iconv.decode(data, "windows-1251");


        for (let i = 0; i < 1; i++) {
            const project = new Project();
            project.name = `Проект ${i}`;
            project.description = `Это описание проекта с номером ${i}`;

            const file = new File();
            file.textSegments = await this.formTextSegments(reg, testString);

            project.files = [file];

            await this.projectRepository.save(project);
            //const finalArr = await this.formTranslatePieces(project, reg, projectRes.text);
            //await this.translateRepository.save(finalArr);
        }
    }

    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }


    async findProjectsByQuery(query: string) {
        return this.projectRepository.find({ where: { name: ILike(`%${query}%`) }, select: ["id", "name", "description"] });
    }

    async findProjectById(id: string) {
        return this.projectRepository.findOne(id, {relations: ["owner.id", "owner.name", "languages"]});
    }

    async createProject(project: PostProjectDto) {
        return this.projectRepository.insert(project);
    }

    async updateProject(projectId: string, project: PostProjectDto) {
        return this.projectRepository.update(projectId, project);
    }

    async formTextSegments(re: RegExp, completeText: string): Promise<TextSegment[]> {
        const array = completeText.split(re).map((splitPart, index) => {
            if (splitPart.length === 0)
                return null

            const textSegment = new TextSegment();
            textSegment.shouldTranslate = index % 2 !== 0;
            textSegment.text = splitPart;

            return textSegment;
        }).filter(segment => segment != null);
        array.forEach((segment, index, array) => {
            if (index === 0)
                return;

            array[index - 1].next = segment;
            segment.previous = array[index - 1];
        });

        return array;
    }
}