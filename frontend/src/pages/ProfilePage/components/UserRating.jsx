import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';
import styles from './UserRating.module.css';

const UserRating = ({ rating }) => {
    return (
        <div className={styles.ratingContainer}>
            <label>Рейтинг</label>
            <div className={styles.rating}>
                <FaStar className={styles.star} />
                <span>{rating.toFixed(1)}</span>
            </div>
        </div>
    );
};

UserRating.propTypes = {
    rating: PropTypes.number.isRequired
};

export default UserRating;