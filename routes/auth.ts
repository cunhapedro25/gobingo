import express from "express"
import 'dotenv/config'
import User from "../models/user.js"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from 'dotenv'
import {requireAdmin} from "../middleware/requireAdmin.js"
import Admin from "../models/admin.js"

dotenv.config()

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL ?? ""
    },
    async function(accessToken, refreshToken, profile, cb) {
        const user = await User.findOneAndUpdate(
            {googleId: profile.id},
            {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails![0].value,
                photo: profile.photos![0].value
            },
            {upsert: true, new: true, runValidators: true}
        ).exec()

        cb(null, user)
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((userinfo: Express.User, done) => {
    done(null, userinfo)
})

const router = express.Router()

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/?authError=true'
}), (req, res) => {
    res.redirect('/')
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
})

router.post("/admin", requireAdmin, async (req, res) => {
    const email: string | undefined = req.body.email

    if(!email) {
        res.sendStatus(400)
        return
    }

    const admin = await Admin.findOne({ email: email }).exec()

    if(!admin) {
        await Admin.create({ email })
        res.sendStatus(200)
    } else {
        res.sendStatus(409)
    }
})

export default router

