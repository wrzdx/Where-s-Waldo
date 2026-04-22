import { useEffect, useState } from "react"
import styles from "./Play.module.css"
import { Loader } from "../Loader/Loader"

const characters = [
  {
    id: crypto.randomUUID(),
    name: "Luffy",
    src: "/luffy.png",
    isFound: false,
  },
  {
    id: crypto.randomUUID(),
    name: "Zoro",
    src: "/zoro.png",
    isFound: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Sanji",
    src: "/sanji.png",
    isFound: false,
  },
]

export function Play() {
  const [counter, setCounter] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toFind, setToFind] = useState(characters)
  let content = <Loader />

  useEffect(() => {
    const key = setInterval(() => {
      setCounter((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(key)
    }
  }, [])

  if (!loading) {
    content = (
      <>
        <h1>WHERE IS STRAWHAT?</h1>
        <p>Try to find Luffy, Zoro and Sanji as soon as possible</p>
        <p>Time: {formatTime(counter)}</p>
        <div className={styles.board}>
          <ul className={styles.characters}>
            {toFind.map((char) => (
              <li key={char.id} className={char.isFound ? styles.found : ""}>
                <img src={char.src} alt={char.name} />
                <p>{char.isFound ? <strike>{char.name}</strike> : char.name}</p>
              </li>
            ))}
          </ul>
          <img className={styles.map} src="/map.png" alt="map" />
        </div>
      </>
    )
  }

  return <main className={styles.play + " container"}>{content}</main>
}

const formatTime = (s) => {
  const m = Math.floor(s / 60)

  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}
