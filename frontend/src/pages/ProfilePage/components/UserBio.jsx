import PropTypes from 'prop-types';
import styles from './UserBio.module.css';

const UserBio = ({ bio }) => {
    return (
        <div className={styles.bioContainer}>
            <label>О себе</label>
            <div className={styles.bioContent}>
                {bio}
            </div>
        </div>
    );
};

UserBio.propTypes = {
    bio: PropTypes.string.isRequired
};

export default UserBio;