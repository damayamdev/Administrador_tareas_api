import type { Request, Response } from 'express'
import { HttpResponse } from '../shared/response/http.response'
import Task from '../models/Task'

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            HttpResponse.OKPERSONALIZADO(res, "Tarea creada correctamente")
        } catch (error) {
            console.log(error)
            HttpResponse.Error(res, error)
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const task = await Task.find({ project: req.project.id }).populate('project')
            if (!task) {
                return HttpResponse.NotFound(res, 'Tarea no Encontrada en la Base de Datos')
            }
            HttpResponse.OK(res, task)
        } catch (error) {
            console.log(error)
            HttpResponse.Error(res, error)
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            HttpResponse.OK(res, req.task)
        } catch (error) {
            console.log(error)
            HttpResponse.Error(res, error)
        }
    }

    static updateTaskById = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            HttpResponse.OKPERSONALIZADO(res, 'Tarea Actualizada Correctamente')
        } catch (error) {
            console.log(error)
            HttpResponse.Error(res, error)
        }
    }

    static deleteTaskById = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            HttpResponse.OKPERSONALIZADO(res, 'Tarea Eliminada Correctamente')
        } catch (error) {
            console.log(error)
            HttpResponse.Error(res, error)
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const {status} = req.body
            req.task.status = status
            await req.task.save()
            HttpResponse.OKPERSONALIZADO(res, 'Estado Actualizado')
        } catch (error) {
            console.log(error)
            HttpResponse.Error(res, error)
        }
    }
}