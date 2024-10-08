import type {Request, Response} from 'express'
import Project from '../models/Project'
import { HttpResponse } from '../shared/response/http.response'


export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        try {
            project.manager = req.user.id
            await project.save()
            return HttpResponse.OK(res, "Proyecto creado correctamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            return HttpResponse.OK(res, projects)
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }
    static getProjectById = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const project= await (await Project.findById(id)).populate('tasks')
            if (!project) {
                return HttpResponse.NotFound(res, 'Proyecto no Encontrado en la Base de Datos')
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                return HttpResponse.NotFound(res, 'Acción no válida')
            }
            return HttpResponse.OK(res, project)
        } catch (error) {
            return HttpResponse.Error(res, error)
        } 
    }
    static updateProjectById = async (req: Request, res: Response) => {
        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description
            
            await req.project.save()
            return HttpResponse.OKPersonalizado(res, 'Proyecto Actualizado Correctamente')

        } catch (error) {
            return HttpResponse.Error(res, error)
        } 
    }
    static deleteProjectById = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            return HttpResponse.OKPersonalizado(res, 'Proyecto Eliminado Correctamente')

        } catch (error) {
            return HttpResponse.Error(res, error)
        } 
    }
}