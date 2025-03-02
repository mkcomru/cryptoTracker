import PropTypes from 'prop-types';
import styles from './UserAvatar.module.css';
import { useRef, useState } from 'react';
import axios from 'axios';

const UserAvatar = ({ src, onAvatarChange }) => {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const getFullAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '../../../img/1387268.png';
        if (avatarPath.startsWith('http')) return avatarPath;
        return `${import.meta.env.VITE_API_URL}${avatarPath}`;
    };

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('http://127.0.0.1:8000/auth/upload-avatar', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.avatar) {
                onAvatarChange(response.data.avatar);
                setSelectedFile(null);
                setPreviewUrl(null);
            } else {
                throw new Error('Неверный формат ответа от сервера');
            }
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            setError('Не удалось загрузить фото: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.avatarContainer}>
            <img 
                src={previewUrl || getFullAvatarUrl(src)}
                alt="User avatar"
                className={styles.avatar}
            />
            {isLoading && <div className={styles.loader}>Загрузка...</div>}
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.buttonGroup}>
                <button 
                    className={styles.selectButton} 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                >
                    Выбрать фото
                </button>
                
                {selectedFile && (
                    <button 
                        className={styles.uploadButton}
                        onClick={handleUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Загрузка...' : 'Загрузить фото'}
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className={styles.fileInput}
                style={{ display: 'none' }}
            />
        </div>
    );
};

UserAvatar.propTypes = {
    src: PropTypes.string.isRequired,
    onAvatarChange: PropTypes.func.isRequired
};

export default UserAvatar;