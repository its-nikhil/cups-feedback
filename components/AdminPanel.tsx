'use client'

import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from 'convex/react'
import UserList from '../components/UserList'
import { api } from '../convex/_generated/api'

export default function AdminPanel({ token }: { token: string }) {
  const session = useQuery(api.feedbackFunctions.getFeedbackSession)
  const startSession = useMutation(api.feedbackFunctions.startSession)
  const stopSession = useMutation(api.feedbackFunctions.stopSession)
  const resetCounts = useMutation(api.feedbackFunctions.resetCounts)

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      <div className="flex space-x-4">
        <Button
          onClick={() => startSession({ token })}
          disabled={session?.isActive}
        >
          Start Session
        </Button>
        <Button
          onClick={() => stopSession({ token })}
          disabled={!session?.isActive}
        >
          Stop Session
        </Button>
        <Button onClick={() => resetCounts({ token })}>Reset Counts</Button>
      </div>
      <div className="w-full">
        <UserList token={token} />
      </div>
    </div>
  )
}
