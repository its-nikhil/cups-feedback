import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function TimeSeriesGraph() {
  const historicalVotes = useQuery(api.feedbackFunctions.getHistoricalVotes, {
    limit: 100,
  })

  if (!historicalVotes) return null

  const data = historicalVotes
    .map((vote) => {
      const total = vote.red + vote.yellow + vote.green
      return {
        timestamp: new Date(vote._creationTime).toLocaleTimeString(),
        red: total ? (vote.red / total) * 100 : 0,
        yellow: total ? (vote.yellow / total) * 100 : 0,
        green: total ? (vote.green / total) * 100 : 0,
      }
    })
    .reverse()
  console.log({ data })

  return (
    <div className="w-full h-64 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis tickFormatter={(x) => `${x}%`} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="red" stroke="#EF4444" />
          <Line type="monotone" dataKey="yellow" stroke="#F59E0B" />
          <Line type="monotone" dataKey="green" stroke="#10B981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
