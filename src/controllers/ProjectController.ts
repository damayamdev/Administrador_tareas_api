import type {Request, Response} from 'express'
import Project from '../models/Project'
import { HttpResponse } from '../shared/response/http.response'


export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        try {
            await project.save()
            HttpResponse.OK(res, "Proyecto creado correctamente")
        } catch (error) {
            HttpResponse.Error(res, error)
        }
    }
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            HttpResponse.OK(res, projects)
        } catch (error) {
            HttpResponse.Error(res, error)
        }
    }
    static getProjectById = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const project= await (await Project.findById(id)).populate('tasks')
            if (!project) {
                return HttpResponse.NotFound(res, 'Proyecto no Encontrado en la Base de Datos')
            }
            HttpResponse.OK(res, project)
        } catch (error) {
            HttpResponse.Error(res, error)
        } 
    }
    static updateProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        try {

            const project = await Project.findById(id)
            
            if (!project) {
                return HttpResponse.NotFound(res, 'Proyecto no Encontrado en la Base de Datos')
            }
            project.clientName = req.body.clientName
            project.projectName = req.body.projectName
            project.description = req.body.description
            
            await project.save()
            HttpResponse.OKPERSONALIZADO(res, 'Proyecto Actualizado Correctamente')

        } catch (error) {
            HttpResponse.Error(res, error)
        } 
    }
    static deleteProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        try {
            const project = await Project.findById(id)
            if (!project) {
                return HttpResponse.NotFound(res, 'Proyecto no Encontrado en la Base de Datos')
            }
            await project.deleteOne()
            HttpResponse.OKPERSONALIZADO(res, 'Proyecto Eliminado Correctamente')

        } catch (error) {
            HttpResponse.Error(res, error)
        } 
    }
}