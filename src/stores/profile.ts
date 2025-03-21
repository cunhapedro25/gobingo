import { defineStore } from 'pinia'
import {Profile} from "@/models/profile.js"
import axios from "axios"

export const useProfileStore = defineStore('profile', {
    state: (): {data: Profile | undefined | null} => {
        return { data: undefined }
    },
    actions: {
        async fetch() {
            try {
                const res = await axios.get("/api/profile")

                this.data = res.data
            } catch (_) {
                this.data = null
            }
        }
    }
})