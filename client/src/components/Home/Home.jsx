import { useEffect, useState } from "react"
import styles from "./Home.module.css"
import { Loader } from "../Loader/Loader"
import { Link } from "react-router"

export function Home() {
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState([
    {
      username: "neo_dev",
      time: 1187,
    },
    {
      username: "wrzdx",
      time: 1324,
    },
    {
      username: "bytehunter",
      time: 1562,
    },
  ])
  let content = <Loader />

  if (!loading) {
    content = (
      <>
        <img src="/waldo-and-luffy.png" alt="Waldo and Luffy" />
        <h1>WHERE IS STRAWHAT?</h1>
        <p>
          Try to find Luffy, Zoro, Sanji as soon as possible
        </p>
        <Link to="play">PLAY NOW</Link>
        {players && (
          <div>
            <h2>Scores</h2>
            <div className={styles.scores}>
              {players.map((player) => (
                <p>
                  <span>{player.username}</span> <span>{player.time}s</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </>
    )
  }
  //   useEffect(() => {
  //     getPosts()
  //       .then(setPosts)
  //       .catch((err) => {
  //         console.error(err)
  //         alert(err.messages || "Something went wrong")
  //       })
  //       .finally(() => setLoading(false))
  //   }, [])

  return <main className={styles.home + " container"}>{content}</main>
}
