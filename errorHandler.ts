import {NextFunction} from "express"

function errorHandler (err: any, req: any, res: any, next: NextFunction) {
    if(err.name === 'UnauthorizedError') {
        res.sendStatus(401)
        return
    }

    next()
}

export default errorHandler