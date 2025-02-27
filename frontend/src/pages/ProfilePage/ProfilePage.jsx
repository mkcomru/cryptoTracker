import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import { FaArrowLeft } from 'react-icons/fa';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedBio, setEditedBio] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(response.data);
            setEditedBio(response.data.bio || '');
        } catch (error) {
            setError('Ошибка при загрузке данных пользователя');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBioUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://127.0.0.1:8000/auth/update-bio', 
                { bio: editedBio },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setUserData({ ...userData, bio: editedBio });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.profilePage}>
            <button onClick={goBack} className={styles.backButton}>
                <FaArrowLeft /> Назад
            </button>
            
            <div className={styles.profileContainer}>
                <h1>Профиль пользователя</h1>
                
                <div className={styles.avatarSection}>
                    <img 
                        src={userData.avatar} 
                        alt="Аватар пользователя" 
                        className={styles.avatar}
                    />
                </div>

                <div className={styles.userInfo}>
                    <div className={styles.infoItem}>
                        <label>Имя пользователя</label>
                        <span>{userData.username}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                        <label>Email</label>
                        <span>{userData.email}</span>
                    </div>

                    <div className={styles.bioSection}>
                        <label>О себе</label>
                        {isEditing ? (
                            <>
                                <textarea
                                    value={editedBio}
                                    onChange={(e) => setEditedBio(e.target.value)}
                                    className={styles.bioTextarea}
                                    placeholder="Расскажите о себе..."
                                />
                                <div className={styles.bioButtons}>
                                    <button 
                                        onClick={handleBioUpdate}
                                        className={styles.saveButton}
                                    >
                                        Сохранить
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedBio(userData.bio || '');
                                        }}
                                        className={styles.cancelButton}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className={styles.bioText}>
                                    {userData.bio || 'Пользователь еще не добавил информацию о себе'}
                                </p>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className={styles.editButton}
                                >
                                    Редактировать
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 