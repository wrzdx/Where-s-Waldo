import { useCallback, useEffect, useRef, useState } from "react"
import styles from "./Play.module.css"
import { Loader } from "../Loader/Loader"
import { Dropdown } from "../Dropdown/Dropdown"
import { useNavigate } from "react-router"
const API_URL = import.meta.env.VITE_API_URL
const characters = [
  {
    id: "luffy",
    name: "Luffy",
    src: "/luffy.png",
    isFound: false,
    x: 53,
    y: 16,
  },
  {
    id: "zoro",
    name: "Zoro",
    src: "/zoro.png",
    isFound: false,
    x: 59,
    y: 11,
  },
  {
    id: "sanji",
    name: "Sanji",
    src: "/sanji.png",
    isFound: false,
    x: 48,
    y: 43,
  },
]

export function Play() {
  const [dropdown, setDropdown] = useState({ visible: false, x: 0, y: 0 })
  const [start, setStart] = useState(null)
  const [now, setNow] = useState(null)
  const [token, setToken] = useState(null)
  const [stopToken, setStopToken] = useState(null)
  const [toFind, setToFind] = useState(characters)
  const mapRef = useRef(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const elapsed = start && now ? Math.floor((now - start) / 1000) : 0

  const finishGame = useCallback(async () => {
    if (!token) return
    const res = await fetch(`${API_URL}/stop`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    })

    if (!res.ok) {
      alert(res.statusText)
      return
    }

    const data = await res.json()
    setStopToken(data.token)
  }, [token])

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      const res = await fetch(`${API_URL}/start`, {
        method: "POST",
      })

      if (!res.ok) {
        alert(res.statusText)
      }
      const data = await res.json()

      if (isMounted) {
        setToken(data.token)
        setStart(Date.now())
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])
  useEffect(() => {
    if (!token) return
    const key = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(key)
  }, [token])
  useEffect(() => {
    if (!toFind.length) return

    if (toFind.every((char) => char.isFound)) {
      finishGame()
    }
  }, [toFind, finishGame])

  const isClose = (x1, y1, x2, y2) => {
    const radius = 3
    const dx = x1 - x2
    const dy = y1 - y2
    return dx * dx + dy * dy <= radius * radius
  }

  const handleSelect = (id, x, y) => {
    setToFind((prev) =>
      prev.map((char) =>
        char.id === id
          ? { ...char, isFound: char.isFound || isClose(x, y, char.x, char.y) }
          : char,
      ),
    )
  }
  const handleMapClick = (e) => {
    e.stopPropagation()
    const rect = mapRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / (rect.right - rect.left)) * 100
    const y = ((e.clientY - rect.top) / (rect.bottom - rect.top)) * 100

    setDropdown({ visible: true, x, y })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    await fetch(`${API_URL}/scores`, {
      method: "POST",
      body: JSON.stringify({
        nickname: form.nickname.value,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + stopToken,
      },
    })
    navigate("/")
  }

  const form = (
    <>
      <div className={styles.backdrop} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Congrats!</h2>
          <input type="text" name="nickname" placeholder="nickname" required />
          <button>Submit</button>
        </form>
      </div>
    </>
  )

  const content = loading ? (
    <Loader />
  ) : (
    <>
      {toFind.every((char) => char.isFound) && form}
      <h1>WHERE IS STRAWHAT?</h1>
      <p>Try to find Luffy, Zoro and Sanji as soon as possible</p>
      <p>Time: {formatTime(elapsed)}</p>
      <div className={styles.board}>
        <ul className={styles.characters}>
          {toFind.map((char) => (
            <li key={char.id} className={char.isFound ? styles.found : ""}>
              <img src={char.src} alt={char.name} />
              <p>{char.isFound ? <strike>{char.name}</strike> : char.name}</p>
            </li>
          ))}
        </ul>
        <div className={styles.map}>
          <img src="/map.png" alt="map" onClick={handleMapClick} ref={mapRef} />
          {toFind
            .filter((char) => char.isFound)
            .map((char) => (
              <div
                key={"mark" + char.id}
                style={{
                  position: "absolute",
                  top: char.y + "%",
                  left: char.x + "%",
                }}
                className={styles.marker}
              >
                ✓
              </div>
            ))}
          <Dropdown
            characters={toFind}
            visible={dropdown.visible}
            position={{ x: dropdown.x, y: dropdown.y }}
            onSelect={(id, x, y) => {
              handleSelect(id, x, y)
              setDropdown((d) => ({ ...d, visible: false }))
            }}
          />
        </div>
      </div>
    </>
  )

  return (
    <main
      onClick={() => setDropdown((d) => ({ ...d, visible: false }))}
      className={styles.play + " container"}
    >
      {content}
    </main>
  )
}

const formatTime = (s) => {
  const m = Math.floor(s / 60)

  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}
