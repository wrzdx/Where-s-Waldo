import { useEffect, useState } from "react"
import styles from "./Home.module.css"
import { Loader } from "../Loader/Loader"
import { Link } from "react-router"
import WaldoAndLuffy from "/waldo-and-luffy.png"
const API_URL = import.meta.env.VITE_API_URL
export function Home() {
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState(null)
  let content = <Loader />

  if (!loading) {
    content = (
      <>
        <img src={WaldoAndLuffy} alt="Waldo and Luffy" />
        <h1>WHERE IS STRAWHAT?</h1>
        <p>Try to find Luffy, Zoro, Sanji as soon as possible</p>
        <Link to="play">PLAY NOW</Link>
        {players && (
          <div>
            <h2>Scores</h2>
            <div className={styles.scores}>
              {players.map((player) => (
                <p key={player.nickname}>
                  <span>{player.nickname}</span> <span>{formatTime(player.score)}s</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </>
    )
  }
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      const res = await fetch(`${API_URL}/scores`)

      if (!res.ok) {
        alert(res.statusText)
      }
      const data = await res.json()

      if (isMounted) {
        setPlayers(data)
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  return <main className={styles.home + " container"}>{content}</main>
}

const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const hundredths = Math.floor((ms % 1000) / 10)

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`
}