import type {Request, Response} from 'express'
import Note, { INote } from '../models/Note'
import { HttpResponse } from '../shared/response/http.response'
import { Types } from 'mongoose'

type NotaParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{},{},INote>, res: Response) => {
        const {content} = req.body
        try {
            const note = new Note()
            note.content = content
            note.createdBy = req.user.id
            note.task = req.task.id
            req.task.notes.push(note.id)
            await Promise.allSettled([req.task.save(), note.save()])
            return HttpResponse.OKPersonalizado(res, "Nota creada correctamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task.id})
            return HttpResponse.OK(res, notes)
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static deleteNote = async (req: Request<NotaParams>, res: Response) => {
        const {noteId} = req.params
        try {
            const note = await Note.findById(noteId)
            if (!note) {
                return HttpResponse.NotFound(res, "Nota no encontrada")
            }

            if (note.createdBy.toString() !== req.user.id.toString()) {
                return HttpResponse.Unauthorized(res, "Acción no Válida")
            }

            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())

            await Promise.allSettled([req.task.save(), note.deleteOne()])
            return HttpResponse.OKPersonalizado(res, "Nota Eliminada correctamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }
}

