import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getFeedbackSession = query({
  handler: async (ctx) => {
    const sessions = await ctx.db.query('feedbackSessions').collect()
    return sessions[0] || { isActive: false }
  },
})

export const getCupCounts = query({
  handler: async (ctx) => {
    return (
      (await ctx.db.query('cupCounts').order('desc').first()) || {
        red: 0,
        yellow: 0,
        green: 0,
      }
    )
  },
})

export const getUsers = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('isAdmin'), true))
      .first()
    if (!adminUser) {
      throw new Error('Admin not found')
    }
    if (token.localeCompare(adminUser.token)) {
      throw new Error('Unauthenticated')
    }

    return await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('isAdmin'), false))
      .collect()
  },
})

export const startSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('isAdmin'), true))
      .first()
    if (!adminUser) {
      throw new Error('Admin not found')
    }
    if (token.localeCompare(adminUser.token)) {
      throw new Error('Unauthenticated')
    }

    const sessions = await ctx.db.query('feedbackSessions').collect()
    if (sessions.length === 0) {
      await ctx.db.insert('feedbackSessions', { isActive: true })
    } else {
      await ctx.db.patch(sessions[0]._id, { isActive: true })
    }
    await ctx.db.insert('cupCounts', { red: 0, yellow: 0, green: 0 })
  },
})

export const stopSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('isAdmin'), true))
      .first()
    if (!adminUser) {
      throw new Error('Admin not found')
    }
    if (token.localeCompare(adminUser.token)) {
      throw new Error('Unauthenticated')
    }

    const sessions = await ctx.db.query('feedbackSessions').collect()
    if (sessions.length > 0) {
      await ctx.db.patch(sessions[0]._id, { isActive: false })
    }
  },
})

export const resetCounts = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('isAdmin'), true))
      .first()
    if (!adminUser) {
      throw new Error('Admin not found')
    }
    if (token.localeCompare(adminUser.token)) {
      throw new Error('Unauthenticated')
    }

    await ctx.db.insert('cupCounts', { red: 0, yellow: 0, green: 0 })
    // Reset all user votes
    const users = await ctx.db.query('users').collect()
    for (const user of users) {
      await ctx.db.patch(user._id, { vote: undefined })
    }
  },
})

export const addUser = mutation({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const tokenBytes = new TextEncoder().encode(Math.random().toString(36))
    const hashBytes = await crypto.subtle.digest('SHA-256', tokenBytes)
    const hash = new TextDecoder('utf-8').decode(hashBytes)
    const existingUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('username'), username))
      .first()
    if (existingUser) {
      throw new Error('Username already exists')
      // welcome back
    }
    await ctx.db.insert('users', {
      username,
      vote: undefined,
      token: hash,
      isAdmin: false,
    })
    return { token: hash }
  },
})

export const getUser = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    return await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('token'), token))
      .first()
  },
})

export const removeUser = mutation({
  args: { username: v.string(), token: v.string() },
  handler: async (ctx, { username, token }) => {
    const adminUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('isAdmin'), true))
      .first()
    if (!adminUser) {
      throw new Error('Admin not found')
    }
    if (token.localeCompare(adminUser.token)) {
      throw new Error('Unauthenticated')
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('username'), username))
      .first()
    if (user) {
      if (user.vote) {
        const counts = await ctx.db.query('cupCounts').order('desc').first()
        if (counts) {
          const newCounts = {
            red: counts.red,
            yellow: counts.yellow,
            green: counts.green,
          }
          newCounts[user.vote as keyof typeof newCounts] =
            (counts[user.vote as keyof typeof counts] as number) - 1
          await ctx.db.insert('cupCounts', newCounts)
        }
      }
      await ctx.db.delete(user._id)
    }
  },
})

export const vote = mutation({
  args: { username: v.string(), color: v.string(), token: v.string() },
  handler: async (ctx, { username, color, token }) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('username'), username))
      .first()
    if (!user) {
      throw new Error('User not found')
    }
    if (token.localeCompare(user.token)) {
      throw new Error('Unauthenticated')
    }

    const counts = (await ctx.db.query('cupCounts').order('desc').first()) || {
      red: 0,
      yellow: 0,
      green: 0,
    }

    // no change
    if (user.vote == color) return

    const newCounts = {
      red: counts.red,
      yellow: counts.yellow,
      green: counts.green,
    }

    newCounts[color as keyof typeof newCounts] =
      (counts[color as keyof typeof counts] as number) + 1
    if (user.vote) {
      newCounts[user.vote as keyof typeof newCounts] =
        (counts[user.vote as keyof typeof counts] as number) - 1
    }

    await ctx.db.insert('cupCounts', newCounts)
    await ctx.db.patch(user._id, { vote: color })
  },
})

export const getHistoricalVotes = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const query = ctx.db.query('cupCounts').order('desc')
    if (limit) {
      return await query.take(limit)
    }
    return await query.collect()
  },
})
