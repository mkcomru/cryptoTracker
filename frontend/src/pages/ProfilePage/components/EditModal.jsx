import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './EditModal.module.css';
import axios from 'axios';

const EditModal = ({ userData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: userData.username || '',
        bio: userData.bio || ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Необходима авторизация');
                window.location.href = '/login';
                return;
            }

            await axios.put('http://127.0.0.1:8000/auth/update-username', {
                username: formData.username
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            await axios.put('http://127.0.0.1:8000/auth/update-bio', {
                bio: formData.bio
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            onSave(formData);
            onClose();
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Сессия истекла. Пожалуйста, войдите снова');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                setError(err.response?.data?.detail || 'Ошибка при обновлении профиля');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Редактировать профиль</h2>
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSaveChanges}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Имя</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="bio">О себе</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button 
                            type="submit" 
                            className={styles.saveButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button 
                            type="button" 
                            className={styles.cancelButton} 
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditModal.propTypes = {
    userData: PropTypes.shape({
        username: PropTypes.string.isRequired,
        bio: PropTypes.string
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default EditModal;