import { PropTypes } from 'prop-types'
import styles from './Modal.module.css'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.message}>{children}</div>
                <button className={styles.closeButton} onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </div>
    )
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
}

export default Modal 