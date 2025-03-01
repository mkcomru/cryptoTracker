import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import { FaArrowLeft } from 'react-icons/fa';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState({
        username: false,
        bio: false
    });
    const [editedData, setEditedData] = useState({
        username: '',
        bio: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(response.data);
            setEditedData({
                username: response.data.username,
                bio: response.data.bio || ''
            });
            setError(null);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Ошибка при загрузке данных пользователя');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleUpdate = async (field) => {
        try {
            const token = localStorage.getItem('token');
            const data = {};
            
            if (field === 'username') {
                data.username = editedData.username;
            } else if (field === 'bio') {
                data.bio = editedData.bio;
            }

            await axios.put(`http://127.0.0.1:8000/auth/update-${field}`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await fetchUserData();
            setEditMode({ ...editMode, [field]: false });
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`Ошибка при обновлении ${field === 'username' ? 'имени пользователя' : 'информации о себе'}`);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Файл слишком большой. Максимальный размер 5MB');
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                alert('Разрешены только форматы JPEG и PNG');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleAvatarUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:8000/auth/upload-avatar', 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setSelectedFile(null);
            await fetchUserData();
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Ошибка при загрузке аватара');
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.mainContent}>
                <div className={styles.leftSection}>
                    <div className={styles.avatarSection}>
                        <img 
                            src={userData.has_avatar ? 
                                `http://127.0.0.1:8000/auth/avatar?t=${new Date().getTime()}` : 
                                'https://api.dicebear.com/7.x/avataaars/svg'
                            } 
                            alt="Аватар пользователя" 
                            className={styles.avatar}
                        />
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleFileSelect}
                            id="avatar-upload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="avatar-upload" className={styles.uploadButton}>
                            Изменить фото
                        </label>
                        {selectedFile && (
                            <button onClick={handleAvatarUpload} className={styles.saveButton}>
                                Сохранить фото
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.userInfo}>
                        <div className={styles.infoItem}>
                            <label>Имя пользователя</label>
                            {editMode.username ? (
                                <div className={styles.editField}>
                                    <input
                                        type="text"
                                        value={editedData.username}
                                        onChange={(e) => setEditedData({
                                            ...editedData,
                                            username: e.target.value
                                        })}
                                        className={styles.editInput}
                                    />
                                    <button onClick={() => handleUpdate('username')} className={styles.saveButton}>
                                        Сохранить
                                    </button>
                                    <button onClick={() => setEditMode({...editMode, username: false})} className={styles.cancelButton}>
                                        Отмена
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.displayField}>
                                    <span>{userData.username}</span>
                                    <button onClick={() => setEditMode({...editMode, username: true})} className={styles.editButton}>
                                        Изменить
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={styles.infoItem}>
                            <label>Email</label>
                            <span>{userData.email}</span>
                        </div>

                        <div className={styles.bioSection}>
                            <label>О себе</label>
                            {editMode.bio ? (
                                <div className={styles.editField}>
                                    <textarea
                                        value={editedData.bio}
                                        onChange={(e) => setEditedData({
                                            ...editedData,
                                            bio: e.target.value
                                        })}
                                        className={styles.bioTextarea}
                                        placeholder="Расскажите о себе..."
                                    />
                                    <button onClick={() => handleUpdate('bio')} className={styles.saveButton}>
                                        Сохранить
                                    </button>
                                    <button onClick={() => setEditMode({...editMode, bio: false})} className={styles.cancelButton}>
                                        Отмена
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.displayField}>
                                    <p>{userData.bio || 'Расскажите о себе...'}</p>
                                    <button onClick={() => setEditMode({...editMode, bio: true})} className={styles.editButton}>
                                        Изменить
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={goBack} className={styles.backButton}>
                <FaArrowLeft /> Назад
            </button>
        </div>
    );
};

export default ProfilePage;