import type { Request, Response } from 'express'
import User from '../models/User'
import { HttpResponse, HttpStatus } from '../shared/response/http.response'
import { checkPassword, hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { generateJWT } from '../utils/jwt'
import { PlantillaAuthEmail } from '../emails/PlantillaAuthEmail'

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

            PlantillaAuthEmail.main(
                {
                    email: user.email,
                    name: user.name,
                    token: token.token,
                    mensaje: "Confirma tu cuenta",
                    mensaje2: "Has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta.",
                    link:"confirm-account"
                }
            )



            await Promise.allSettled([user.save(), token.save()])
            return HttpResponse.OKPersonalizado(res, "Cuenta creada, revisa tu email para confirmarla")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })

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

            const { email, password } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return HttpResponse.NotFound(res, "Usuario no encontrado")
            }

            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                PlantillaAuthEmail.main(
                    {
                        email: user.email,
                        name: user.name,
                        token: token.token,
                        mensaje: "Confirma tu cuenta",
                        mensaje2: "Has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta.",
                        link:"confirm-account"
                    }
                )

                return HttpResponse.Unauthorized(res, "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación")
            }

            const isPasswordCorrect = await checkPassword(password, user.password)

            if (!isPasswordCorrect) {
                return HttpResponse.Unauthorized(res, "La Contraseña no es correcta")
            }

            const token = generateJWT({id: user._id})

            return HttpResponse.OKPersonalizado(res, token)
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return HttpResponse.NotFound(res, "No existe un usuario con el e-mail ")
            }

            if (user.confirmed) {
                return HttpResponse.Personalizado(HttpStatus.CONFLICT, "Conflict", res, "El usuario ya esta confirmado ")
            }

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            PlantillaAuthEmail.main(
                {
                    email: user.email,
                    name: user.name,
                    token: token.token,
                    mensaje: "Confirma tu cuenta",
                    mensaje2: "Has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta.",
                    link:"confirm-account"
                }
            )

            await Promise.allSettled([user.save(), token.save()])
            return HttpResponse.OKPersonalizado(res, "Se envió un nuevo token a tu e-mail")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                return HttpResponse.NotFound(res, "No existe un usuario con el e-mail ")
            }

            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            PlantillaAuthEmail.main({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                    mensaje: "Reestablecer contraseña",
                    link: "new-password"
                })
            await token.save()
            return HttpResponse.OKPersonalizado(res, "Revisa tu email para instrucciones")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static validaToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({ token })

            if (!tokenExists) {
                return HttpResponse.NotFound(res, "El token no es válido")
            }


            return HttpResponse.OKPersonalizado(res, "Token válido, Define tu nueva contraseña")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token })

            if (!tokenExists) {
                return HttpResponse.NotFound(res, "El token no es válido")
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            return HttpResponse.OKPersonalizado(res, "La contraseña se cambió exitosamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static user = async (req: Request, res: Response) => {
        try {
            return HttpResponse.OK(res, req.user)
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const {name, email} = req.body

            const userExists = await User.findOne({ email })
            if (userExists && userExists.id.toString() !== req.user.id.toString()) {
                return HttpResponse.Personalizado(HttpStatus.CONFLICT, "Conflict", res, "El e-mail ya se encuentra registrado en la base de datos")
            } 

            req.user.name = name
            req.user.email = email
            //req.user.confirmed = false
            await req.user.save()
            return HttpResponse.OKPersonalizado(res, "Perfil actualizado correctamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }
    
    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const {current_password, password} = req.body
        try {
            const user = await User.findById(req.user.id)
            const isPasswordCorrect = await checkPassword(current_password, user.password)
            if (!isPasswordCorrect) {
                return HttpResponse.Personalizado(HttpStatus.ANAUTHORIZED, "Anauthorized", res, "La contraseña actual es incorrecta")
            } 
            user.password = await hashPassword(password)
            await user.save()
            return HttpResponse.OKPersonalizado(res, "La contraseña se modificó correctamente")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }

    }

    static checkPassword = async (req: Request, res: Response) => {
        const {password} = req.body
        try {
            const user = await User.findById(req.user.id)
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                return HttpResponse.Personalizado(HttpStatus.ANAUTHORIZED, "Anauthorized", res, "La contraseña actual es incorrecta")
            } 
            return HttpResponse.OKPersonalizado(res, "La contraseña es correcta")
        } catch (error) {
            return HttpResponse.Error(res, error)
        }
    }
}