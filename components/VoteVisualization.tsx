import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

export default function VoteVisualization() {
  const counts = useQuery(api.feedbackFunctions.getCupCounts)

  if (!counts) return null

  const total = counts.red + counts.yellow + counts.green
  const redPercentage = (counts.red / total) * 100 || 0
  const yellowPercentage = (counts.yellow / total) * 100 || 0
  const greenPercentage = (counts.green / total) * 100 || 0

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Vote Distribution</h2>
      <div className="relative w-32 h-64 bg-gray-200 rounded-b-full overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 bg-green-500 text-center"
          style={{
            height: `${greenPercentage + yellowPercentage + redPercentage}%`,
          }}
        >
          {greenPercentage.toFixed(2)}%
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 bg-yellow-500 text-center"
          style={{ height: `${yellowPercentage + redPercentage}%` }}
        >
          {yellowPercentage.toFixed(2)}%
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 bg-red-500 text-center"
          style={{ height: `${redPercentage}%` }}
        >
          {redPercentage.toFixed(2)}%
        </div>
      </div>
      <div className="flex justify-between w-full max-w-xs">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {counts.green}
          </div>
          <div>Green</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">
            {counts.yellow}
          </div>
          <div>Yellow</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{counts.red}</div>
          <div>Red</div>
        </div>
      </div>
    </div>
  )
}
