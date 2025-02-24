import styles from './MainPage.module.css';
import { Link } from 'react-router-dom';

const MainPage = () => {

    return (
        <div>
            <h1 className={styles.title}>Добро пожаловать на главную страницу!</h1>
            <p className={styles.description}>Здесь вы можете найти информацию о криптовалютах, проверить IMEI и узнать больше о нашем проекте.</p>
            <div className={styles.buttonContainer}>
                <Link to="/crypto" className={styles.button}>Перейти к крипто-трекеру</Link>
                <Link to="/imei" className={styles.button}>Проверка IMEI</Link>
            </div>
        </div>
    );
};

export default MainPage;