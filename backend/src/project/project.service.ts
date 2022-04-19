import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Project from "entities/Project.entity";
import { ILike, Repository } from "typeorm";
import TranslatePiece from "entities/TranslatePiece.entity";
import * as fs from "fs/promises";
import * as iconv from "iconv-lite";
import { TextPiece } from "entities/TextPiece.entity";
import { TextpieceService } from "TextPiece/TextPiece.service";
import { PostProjectDto, GetProjectDto } from "common/dto/project.dto";

@Injectable()
export class ProjectService implements OnApplicationBootstrap {
    async onApplicationBootstrap() {
        const reg = /\s+[^.!?]*[.!?]/g;
        let testString = "";
        const data = await fs.readFile("../test.txt");
        testString = iconv.decode(data, "windows-1251");


        for (let i = 0; i < 1; i++) {
            const project = new Project();
            project.name = `Проект ${i}`;
            project.description = `Это описание проекта с номером ${i}`;

            project.text = await this.textPieceService.makeTextPiecesArray(project, testString);

            const projectRes = await this.projectRepository.save(project);
            const finalArr = await this.formTranslatePieces(project, reg, projectRes.text);
            await this.translateRepository.save(finalArr);
        }        
    }

    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private textPieceService: TextpieceService,
        @InjectRepository(TranslatePiece)
        private translateRepository: Repository<TranslatePiece>
    ) { }


    async findProjectsByQuery(query: string) {
        return this.projectRepository.find({ where: { name: ILike(`%${query}%`) } });
    }

    async findProjectById(id: string) {
        return this.projectRepository.findOne(id);
    }

    // async getPiecesByProject(project: Project) {
    //     const tempProj = await this.projectRepository.findOne(project.id, {relations: ['text']});
    //     return tempProj.text;
    // }

    async createProject(project: PostProjectDto) {
        return this.projectRepository.insert(project);
    }

    async updateProject(projectId: string, project: PostProjectDto) {
        return this.projectRepository.update(projectId, project);
    }

    async formTranslatePieces(project: Project, re: RegExp, textPieces: TextPiece[]) {
        const textPiecesWithCount = textPieces.map(curPiece => ({ start: 0, piece: curPiece, replacings: [] }));
        textPiecesWithCount.reduce((prev, pieceWithCount) => {
            pieceWithCount.start = prev;
            return prev + pieceWithCount.piece.text.length;
        }, 0);

        const completeText = textPieces.reduce((prev, piece) => prev + piece.text, "");
        
        const regexpResults = completeText.matchAll(re);
        const arr = Array.from(regexpResults).slice(0, 100);
        const finalArr = arr.map((match, index) => {
            const left = match.index;
            const right = left + match[0].length;

            const translatePiece = new TranslatePiece();
            translatePiece.before = match[0];
            translatePiece.id = index;
            

            const filtered = textPiecesWithCount.filter(piece => ((left < (piece.start + piece.piece.text.length)) && (piece.start < right)));
            const filteredLength = filtered.length;

            filtered.forEach((filteredPiece, index) => {
                const leftBound = Math.max(left, filteredPiece.start) - filteredPiece.start;
                const rightBound = Math.min(right, filteredPiece.start + filteredPiece.piece.text.length) - filteredPiece.start;
                const replaceTemplate = {id: translatePiece.id, part: index, length: filteredLength};
                const replaceString = JSON.stringify(replaceTemplate);

                filteredPiece.replacings = [...filteredPiece.replacings, {left: leftBound, right: rightBound, replace: replaceString}]
            })
            
            translatePiece.textPieces = filtered.map(e => e.piece);
            return translatePiece;
        })

        textPiecesWithCount.forEach(piece => {
            const orderedReplacements = piece.replacings.sort((a, b) => b.right - a.right);
            orderedReplacements.forEach(replacement => {
                const originalString = piece.piece.text;
                piece.piece.text = originalString.substring(0, replacement.left) + replacement.replace + originalString.substring(replacement.right, originalString.length);
            })
        })

        return finalArr;
    }
}