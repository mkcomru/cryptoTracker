import styles from './ImeiCheck.module.css'
import { PropTypes } from 'prop-types';


const ImeiCheck = (props) => {
    const { onImeiChange, onCheckImei } = props

    return (
        <div className={styles.imeiCheckForm}>
            <h1>Проверь свой IMEI</h1>
            <input type="text" placeholder="Введите IMEI" onChange={onImeiChange} />
            <button onClick={onCheckImei}>Проверить</button>
        </div>
    );
};

ImeiCheck.propTypes = {
    imei: PropTypes.string.isRequired,
    onImeiChange: PropTypes.func.isRequired,
    onCheckImei: PropTypes.func.isRequired
};

export default ImeiCheck;