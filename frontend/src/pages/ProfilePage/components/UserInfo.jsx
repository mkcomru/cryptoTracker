import PropTypes from 'prop-types';
import styles from './UserInfo.module.css';

const UserInfo = ({ userData }) => {

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.infoContainer}>
            <div className={styles.field}>
                <label>Имя</label>
                <div className={styles.value}>
                    {userData.username}
                </div>
            </div>

            <div className={styles.field}>
                <label>Возраст</label>
                <div className={styles.value}>19 лет</div>
            </div>

            <div className={styles.field}>
                <label>Телефон</label>
                <div className={styles.value}>+7 963 848-71-65</div>
            </div>

            <div>
                <label>Email</label>
                <div className={styles.value}>{userData.email}</div>
            </div>
        </div>
    );
};

UserInfo.propTypes = {
    userData: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired
    }).isRequired
};

export default UserInfo;