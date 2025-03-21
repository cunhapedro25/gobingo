import express from "express"
import authRoutes from './auth.js'
import bingoRoutes from './bingo.js'
import {requireAuth} from "../middleware/requireAuth.js"
import Admin from "../models/admin.js"
import User from "../models/user.js";

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/bingo", bingoRoutes)
router.get("/profile", requireAuth, async (req, res) => {
    // @ts-ignore
    const user: {_id: string, name: string, email: string, photo: string} = req.user!

    res.send({
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        admin: await Admin.exists({ email: user.email }) != null
    })
})

router.get("/user/:id", async (req, res) => {
    // @ts-ignore
    const user: {_id: string, name: string, email: string, photo: string} = await User.findById(req.params.id)

    res.send({
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        admin: await Admin.exists({ email: user.email }) != null
    })
})

export default router