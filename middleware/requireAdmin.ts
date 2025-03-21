import {NextFunction} from "express"
import Admin from "../models/admin.js"

export async function requireAdmin (req: any, res: any, next: NextFunction) {
    if (req.isAuthenticated() && await Admin.exists({ email: req.user!.email })) {
        return next()
    }
    return res.sendStatus(401)
}