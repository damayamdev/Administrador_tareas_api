import type { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/response/http.response'
import Project, { IProject } from '../models/Project'

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function projectExists(req: Request, res: Response, next: NextFunction) {

    const { projectId } = req.params

    try {
        const project = await Project.findById(projectId)
        if (!project) {
            return HttpResponse.NotFound(res, 'Proyecto no Encontrado en la Base de Datos')
        }
        req.project = project
        next()
    } catch (error) {
        HttpResponse.Error(res, error)
    }
}