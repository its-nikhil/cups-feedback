import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function UserList({ token }: { token: string }) {
  const users = useQuery(
    api.feedbackFunctions.getUsers,
    token ? { token } : 'skip'
  )
  const removeUser = useMutation(api.feedbackFunctions.removeUser)

  if (!users) return null
  console.log(users)

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Active Users</h2>
      <div className="w-full max-w-md space-y-2">
        {users.length === 0 && <p>No active user!</p>}
        {users.map((user, idx) => (
          <div
            key={user._id}
            className={cn(
              `flex justify-between items-center p-2 bg-gray-100 bg-green-100 bg-red-100 bg-yellow-100 bg-${user.vote || 'gray'}-100 rounded`
            )}
          >
            <span>
              {idx + 1}. {user.username}
            </span>
            <Button
              onClick={() => removeUser({ username: user.username, token })}
              variant="destructive"
              size="sm"
            >
              Kick
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
