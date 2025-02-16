import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  feedbackSessions: defineTable({
    isActive: v.boolean(),
  }),
  cupCounts: defineTable({
    red: v.number(),
    yellow: v.number(),
    green: v.number(),
  }),
  users: defineTable({
    username: v.string(),
    vote: v.optional(v.string()),
    token: v.string(),
    isAdmin: v.boolean(),
  }).searchIndex('search_username', {
    searchField: 'username',
  }),
})
