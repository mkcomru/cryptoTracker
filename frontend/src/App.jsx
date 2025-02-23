import CryptoPage from './pages/CryptoPage/CryptoPage'
import Header from './components/Header/Header'
import styles from './App.module.css'

const App = () => {


  return (
    <div className={styles.app}>
      <Header />
      <CryptoPage />
    </div>
  )
}

export default App