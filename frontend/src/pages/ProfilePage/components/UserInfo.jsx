import PropTypes from 'prop-types';
import styles from './UserInfo.module.css';

const UserInfo = ({ user }) => {
    return (
        <div className={styles.infoContainer}>
            <div className={styles.field}>
                <label>ФИО</label>
                <div className={styles.value}>
                    {`${user.lastName} ${user.firstName} ${user.middleName}`}
                </div>
            </div>

            <div className={styles.field}>
                <label>Возраст</label>
                <div className={styles.value}>{user.age} лет</div>
            </div>

            <div className={styles.field}>
                <label>Телефон</label>
                <div className={styles.value}>{user.phone}</div>
            </div>

            <div>
                <label>Email</label>
                <div className={styles.value}>{user.email}</div>
            </div>
        </div>
    );
};

UserInfo.propTypes = {
    user: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        middleName: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        phone: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired
    }).isRequired
};

export default UserInfo;