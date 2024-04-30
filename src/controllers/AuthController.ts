import type { Request, Response } from 'express'
import User from '../models/User'
import { HttpResponse, HttpStatus } from '../shared/response/http.response'
import { checkPassword, hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            const userExists = await User.findOne({ email })
            if (userExists) {
                return HttpResponse.Personalizado(HttpStatus.CONFLICT, "Conflict", res, "El e-mail ya se encuentra registrado en la base de datos")
            }

            const user = new User(req.body)
            user.password = await hashPassword(password)

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.email,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            return HttpResponse.OKPersonalizado(res, "Cuenta creada, revisa tu email para confirmarla")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({token})

            if (!tokenExists) {
                return HttpResponse.NotFound(res, "El token no es válido")
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            return HttpResponse.OKPersonalizado(res, "Cuenta confirmada correctamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static login = async (req: Request, res: Response) => {
        try {

            const {email, password} = req.body

            const user = await User.findOne({email})
            if (!user) {
                return HttpResponse.NotFound(res, "Usuario no encontrado")
            }

            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                return HttpResponse.Unauthorized(res, "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación")
            }

            const isPasswordCorrect = await checkPassword(password, user.password)

            if (!isPasswordCorrect) {
                return HttpResponse.Unauthorized(res, "La Contraseña no es correcta")
            }

            return HttpResponse.OKPersonalizado(res, 'autenticado')
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }
}