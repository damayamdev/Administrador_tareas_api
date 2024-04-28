import type {Request, Response, NextFunction} from 'express'
import {validationResult} from 'express-validator'
import { HttpResponse } from '../shared/response/http.response'

export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return HttpResponse.NotFound(res, errors.array())
    }
    next()
} 