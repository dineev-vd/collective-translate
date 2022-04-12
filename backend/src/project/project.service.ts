import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Project from "@entities/Project.entity";
import { ILike, Repository } from "typeorm";

@Injectable()
export class ProjectService implements OnApplicationBootstrap {
    onApplicationBootstrap() {
        let projectArray: Project[] = [];
        for (let index = 0; index < 10; index++) {
            const project = new Project();
            project.name = `Проект ${index}`;
            project.text = `${index}`;
            project.description = `Это описание проекта с номером ${index}`;
            
            projectArray = [...projectArray, project]
        }

        this.projectRepository.save(projectArray).then(_ => console.log('Test entries added.'));
    }

    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>
    ) { }


    searchProject(query: string): Promise<Project[]> {
        return this.projectRepository.find({ where: { name: ILike(`%${query}%`) } });
    }

    getProject(id: string): Promise<Project> {
        return this.projectRepository.findOne(id);
    }
}