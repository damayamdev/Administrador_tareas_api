import { Request, Response } from "express";
import { HttpResponse } from "../shared/response/http.response";
import User from "../models/User";
import Project from "../models/Project";


export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body
        try {
            const user = await User.findOne({ email }).select('id name email')

            if (!user) {
                return HttpResponse.NotFound(res, 'Usuario no Encontrado en la Base de Datos')
            }

            return HttpResponse.OK(res, user)
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static addMemberBtId = async (req: Request, res: Response) => {
        const { id } = req.body

        try {
            const user = await User.findById(id).select('id')

            if (!user) {
                return HttpResponse.NotFound(res, 'Usuario no Encontrado en la Base de Datos')
            }

            if (req.project.team.some(team => team.toString() === user.id.toString())) {
                return HttpResponse.NotFound(res, 'El usuario ya existe en el proyecto')
            }

            req.project.team.push(user.id)
            await req.project.save()
            return HttpResponse.OKPersonalizado(res, "Usuario agregado correctamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static deleteMemberBtId = async (req: Request, res: Response) => {
        const { userId } = req.params
        try {

            if (!req.project.team.some(team => team.toString() === userId )) {
                return HttpResponse.NotFound(res, 'El usuario no existe en el proyecto')
            }

            req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)

            await req.project.save()

            return HttpResponse.OKPersonalizado(res, "El usuario se elimino correctamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }

    }

    static getProjectTeam = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.project.id).populate({
                path: 'team',
                select: 'id email name'
            })
            return HttpResponse.OK(res, project.team)
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }
}