import styles from './AboutPage.module.css';
// import {FaArrowLeft} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const AboutPage = () => {

    const navigate = useNavigate();
    const goToPage = () => {
        navigate(-1);
    }

    return (
        <div className={styles.container}>
            <div className={styles.intro}>
                <p className={styles.text}>Я - начинающий разработчик, учусь в Вузе на 2 курсе  и практикуюсь,
                    подкрепляю теоритические знания практикой. Этот сайт - мой пет проект, написанный на 
                    интересных для меня технологийх - FastAPI и React. Здесь реализованна авторизация и добавление
                    пользователя в базу данных, а так же крипто трекер и проверка IMEI - взаимодействие 
                    со сторонним API. 
                </p>
            </div>
            <div className={styles.socialLinks}>
                <button className={styles.backbtn} onClick={goToPage}>
                    Назад
                    {/* <FaArrowLeft/> */}
                </button>
            </div>
        </div>
    );
};

export default AboutPage;