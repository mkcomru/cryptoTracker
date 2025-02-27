import { Link } from 'react-router-dom'
import { useState } from 'react'
import styles from './Header.module.css'
import Modal from '../Modal/Modal'
import LoginForm from '../Auth/LoginForm'
import RegisterForm from '../Auth/RegisterForm'
import { FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }

    const handleProfileClick = () => {
        navigate('/profile')
    }

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <nav className={styles.navigation}>
                    <Link to="/" className={styles.link}>Главная</Link>
                    <Link to="/crypto" className={styles.link}>Крипто-трекер</Link>
                    <Link to="/imei" className={styles.link}>Проверка IMEI</Link>
                    <Link to="/about" className={styles.link}>О проекте</Link>
                </nav>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.authButtons}>
                    {token ? (
                        <div className={styles.userSection}>
                            <FaUser 
                                className={styles.userIcon} 
                                onClick={handleProfileClick}
                            />
                            <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
                        </div>
                    ) : (
                        <>
                            <button onClick={() => setIsLoginOpen(true)} className={styles.loginBtn}>Войти</button>
                            <button onClick={() => setIsRegisterOpen(true)} className={styles.registerBtn}>Зарегистрироваться</button>
                        </>
                    )}
                </div>
            </div>

            <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
                <LoginForm onClose={() => setIsLoginOpen(false)} />
            </Modal>

            <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
                <RegisterForm onClose={() => setIsRegisterOpen(false)} />
            </Modal>

            <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
            </Modal>
        </header>
    );
};

export default Header;