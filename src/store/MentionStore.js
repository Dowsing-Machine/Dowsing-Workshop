import _ from "lodash"

import { defineStore } from 'pinia'

import Mention from "@/models/Mention"

export const MentionStore = defineStore({
    id: "MentionStore",
    state: () => ({
        mentions: [],
        mode: "添加",
        tempMention: new Mention(),
    }),
    actions: {
        addMention(mention = null) {
            if (mention == null) { mention = this.tempMention }
            this.mentions.push(mention);
            this.mode = "添加";
            this.tempMention = new Mention();
        },
    },
})
