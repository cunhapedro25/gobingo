import mongoose from "mongoose"
import {z} from "zod"

const bingoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    phrases: { type: Array<String>, required: true }
})

const Bingo = mongoose.model('Bingo', bingoSchema)

export const bingoValidator = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(32, "Title too large")
        .refine((x) => x.trim().length > 0, "Answer must not contain only whitespace"),
    phrases: z.array(z.string())
})

export default Bingo