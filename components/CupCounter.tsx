import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"

export default function CupCounter() {
  const counts = useQuery(api.feedbackFunctions.getCupCounts)

  if (!counts) return null

  return (
    <div className="flex justify-center space-x-4 p-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-500">{counts.green}</div>
        <div>Green</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-500">{counts.yellow}</div>
        <div>Yellow</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-500">{counts.red}</div>
        <div>Red</div>
      </div>
    </div>
  )
}

