import {requireAuth} from "../middleware/requireAuth"
import errorHandler from "../errorHandler"
import express from "express"
import Bingo, {bingoValidator} from "../models/bingo"

const router = express.Router()

router.use(errorHandler)

router.get("/", async (req, res) => {
    res.json(Bingo.find())
})

router.get("/:id", async (req, res) => {
    try {
        const bingo = await Bingo.findById(req.params.id)

        if (!bingo) {
            res.status(404)
            return
        }
        res.json(bingo)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', requireAuth, async (req, res) => {
    try {
        const validatedData = bingoValidator.parse(req.body)

        const bingo = new Bingo({
            title: validatedData.title,
            phrases: validatedData.phrases,
        })

        await bingo.save()
        res.status(201).send(bingo._id)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

export default router