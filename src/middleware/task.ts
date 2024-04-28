import type { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/response/http.response'
import Task, { ITask } from '../models/Task'

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists(req: Request, res: Response, next: NextFunction) {

    const { taskId } = req.params

    try {
        const task = await Task.findById(taskId)
        if (!task) {
            return HttpResponse.NotFound(res, 'Tarea no Encontrado en la Base de Datos')
        }
        req.task = task
        next()
    } catch (error) {
        HttpResponse.Error(res, error)
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.task.project.toString() !== req.project.id.toString()) {
            return HttpResponse.NotFound(res, 'Acción no válida')
        }
        next()
    } catch (error) {
        HttpResponse.Error(res, error)
    }
}