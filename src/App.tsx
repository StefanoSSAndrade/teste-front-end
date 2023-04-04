import { Posts } from "./components/Posts"
import "./global.css"
import styles from "./App.module.css"

export const App = () => {

  return (
    <div className={styles.mainContainer}>
      <Posts />
    </div>
  )
}

