import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

export default function StudentFeedback({
  token,
  username,
}: {
  token: string
  username: string
}) {
  const session = useQuery(api.feedbackFunctions.getFeedbackSession)
  const vote = useMutation(api.feedbackFunctions.vote)
  const [selectedCup, setSelectedCup] = useState<string | null>(null)

  if (!session || !session.isActive) {
    return (
      <div className="text-center p-4">Waiting for session to start...</div>
    )
  }

  const handleCupClick = (color: string) => {
    vote({ username, color, token })
    setSelectedCup(color)
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Student Feedback</h2>
      <div className="flex space-x-4">
        <Button
          onClick={() => handleCupClick('green')}
          className={`bg-green-500 hover:bg-green-600 ${selectedCup === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
        >
          Green
        </Button>
        <Button
          onClick={() => handleCupClick('yellow')}
          className={`bg-yellow-500 hover:bg-yellow-600 ${selectedCup === 'yellow' ? 'ring-2 ring-offset-2 ring-yellow-500' : ''}`}
        >
          Yellow
        </Button>
        <Button
          onClick={() => handleCupClick('red')}
          className={`bg-red-500 hover:bg-red-600 ${selectedCup === 'red' ? 'ring-2 ring-offset-2 ring-red-500' : ''}`}
        >
          Red
        </Button>
      </div>
    </div>
  )
}
