import { useState, useEffect } from 'react'
import AdminPanel from '../components/AdminPanel'
import UsernameSelection from '../components/UsernameSelection'
import StudentFeedback from '../components/StudentFeedback'
import VoteVisualization from '../components/VoteVisualization'

export default function Home() {
  const [user, setUser] = useState<{
    username: string
    isAdmin: boolean
  } | null>(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) setToken(t)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Cups as student feedback
      </h1>
      {!user ? (
        <div className="md:flex">
          <div className="flex-1">
            <Instructions />
          </div>
          <div className="flex-1">
            <UsernameSelection
              token={token}
              setToken={setToken}
              onUsernameSelected={setUser}
            />
          </div>
        </div>
      ) : user.isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AdminPanel token={token} />
          <VoteVisualization />
        </div>
      ) : (
        <>
          <StudentFeedback token={token} username={user.username} />
          <VoteVisualization />
        </>
      )}
    </div>
  )
}

const Instructions = () => (
  <>
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-6">
      Purpose:
    </h2>
    <p className="leading-7">
      To create a non-­‐verbal system in which students can communicate and
      provide feedback to the teacher in supporting student learning
    </p>
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6">
      Definition of the cups:
    </h2>
    <ul>
      <li>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Green
        </h4>
        <p className="leading-7 mb-6">
          I am comfortable with my understanding and the pacing of the lesson
        </p>
      </li>
      <li>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Yellow
        </h4>
        <p className="leading-7 mb-6">
          I am working through my understanding, I would benefit from the
          teacher slowing down or revisiting the current concept
        </p>
      </li>
      <li>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Red
        </h4>
        <p className="leading-7 mb-6">
          STOP! I am not understanding and I have a question
        </p>
      </li>
    </ul>
  </>
)
