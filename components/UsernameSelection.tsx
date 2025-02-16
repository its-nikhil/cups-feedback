'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

export default function UsernameSelection({
  token,
  setToken,
  onUsernameSelected,
}: {
  token: string
  setToken: (token: string) => void
  onUsernameSelected: (user: { username: string; isAdmin: boolean }) => void
}) {
  const [username, setUsername] = useState('')
  const addUser = useMutation(api.feedbackFunctions.addUser)
  const user = useQuery(
    api.feedbackFunctions.getUser,
    token ? { token } : 'skip'
  )
  if (user?.username)
    onUsernameSelected({ username: user.username, isAdmin: user.isAdmin })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newUser = await addUser({ username })
      localStorage.setItem('token', newUser.token)
      setToken(newUser.token)
      onUsernameSelected({ username, isAdmin: false })
    } catch (error) {
      console.error(error)
      localStorage.removeItem('token')
      setToken('')
      alert('Username already exists. Please choose another.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 p-4"
    >
      <h2 className="text-2xl font-bold">Enter Your Username</h2>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="max-w-xs bg-white"
      />
      <Button type="submit" disabled={!username}>
        Join Session
      </Button>
    </form>
  )
}
