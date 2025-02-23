import CryptoPage from './pages/CryptoPage/CryptoPage'
import Header from './components/Header/Header'
import styles from './App.module.css'
import ImeiCheckPage from './pages/IMEICheckPage/ImeiCheckPage'

const App = () => {


  return (
    <div className={styles.app}>
      <Header />
      <ImeiCheckPage />
    </div>
  )
}

export default App