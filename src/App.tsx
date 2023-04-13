import styles from "./App.module.css"
import "./global.css"
import { Feed } from "./components/Feed"

export const App = () => {

  return (
    <div className={styles.mainContainer}>
        <Feed />
    </div>
  )
}

