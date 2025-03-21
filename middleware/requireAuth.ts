import {NextFunction} from "express"

export function requireAuth (req: any, res: any, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.sendStatus(401)
}