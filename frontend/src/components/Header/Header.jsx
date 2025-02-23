import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => {

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <nav className={styles.navigation}>
                    <a>Главная</a>
                    <a>Крипто-трекер</a>
                    <a>Проверить IMEI</a>
                    <a>О проекте</a>
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