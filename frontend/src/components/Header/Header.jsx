import { Link } from 'react-router-dom'
import styles from './Header.module.css'

const Header = () => {
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
                    <a className={styles.loginBtn}>Войти</a>
                    <a className={styles.registerBtn}>Зарегистрироваться</a>
                </div>
            </div>
        </header>
    );
};

export default Header;