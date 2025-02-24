import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CryptoPage from './pages/CryptoPage/CryptoPage'
import Header from './components/Header/Header'
import styles from './App.module.css'
import ImeiCheckPage from './pages/IMEICheckPage/ImeiCheckPage'
import MainPage from './pages/MainPage/MainPage'
import AboutPage from './pages/AboutPage/AboutPage'


const App = () => {
  return (
    <Router>
      <div className={styles.app}>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/crypto" element={<CryptoPage />} />
          <Route path="/imei" element={<ImeiCheckPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App