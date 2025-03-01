import PropTypes from 'prop-types';
import styles from './UserAvatar.module.css';
import { useRef } from 'react';

const UserAvatar = ({ src, onAvatarChange }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onAvatarChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.avatarWrapper}>
            <div className={styles.avatarContainer}>
                <img 
                    src={src} 
                    alt="Фото профиля"
                    className={styles.avatar}
                    onError={(e) => {
                        e.target.src = '../../../img/photo_2023-07-19_22-18-15.jpg';
                    }}
                />
            </div>
            <button className={styles.changePhotoButton} onClick={() => fileInputRef.current?.click()}>Изменить фото</button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
            />
        </div>
    );
};

UserAvatar.propTypes = {
    src: PropTypes.string.isRequired,
    onAvatarChange: PropTypes.func.isRequired
};

export default UserAvatar;