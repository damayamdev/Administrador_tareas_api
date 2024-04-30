import { Response } from "express";

export enum HttpStatus {
    OK = 200,
    NOT_FOUND = 404,
    ANAUTHORIZED = 401,
    FORBIDDEN = 403,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}

export class HttpResponse {
    static OK(res: Response, data?: any): Response {
        return res.status(HttpStatus.OK).json({
            httpStatusCode: HttpStatus.OK,
            statusMsg: 'Success',
            data: data
        })
    }

    static OKPersonalizado(res: Response, msg?: any): Response {
        return res.status(HttpStatus.OK).json({
            httpStatusCode: HttpStatus.OK,
            statusMsg: 'Success',
            Msg: msg
        })
    }

    static NotFound(res: Response, data?: any): Response {
        return res.status(HttpStatus.NOT_FOUND).json({
            httpStatusCode: HttpStatus.NOT_FOUND,
            statusMsg: 'Not Found',
            error: data
        })
    }

    static Unauthorized(res: Response, data?: any): Response {
        return res.status(HttpStatus.ANAUTHORIZED).json({
            httpStatusCode: HttpStatus.ANAUTHORIZED,
            statusMsg: 'Unauthorized',
            error: data
        })
    }

    static Forbidden(res: Response, data?: any): Response {
        return res.status(HttpStatus.FORBIDDEN).json({
            httpStatusCode: HttpStatus.FORBIDDEN,
            statusMsg: 'Forbidden',
            error: data
        })
    }

    static Error(res: Response, data?: any): Response {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            statusMsg: 'Internal server error',
            error: data
        })
    }

    static Personalizado(code: HttpStatus, statusMsg: string ,res: Response, data?: any): Response {
        return res.status(code).json({
            httpStatusCode: code,
            statusMsg: statusMsg,
            error: data
        })
    }
}