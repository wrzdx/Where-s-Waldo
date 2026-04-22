import styles from "./Dropdown.module.css"

export function Dropdown({ characters, onSelect, position, visible }) {
  if (!visible) return null

  return (
    <ul
      style={{
        position: "absolute",
        top: position.y + "%",
        left: position.x + "%",
      }}
      className={styles.dropdown}
    >
      {characters.map((char) => (
        <li
          key={char.id}
          onClick={() => onSelect(char.id, position.x, position.y)}
        >
          {char.name}
        </li>
      ))}
    </ul>
  )
}
