import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import { FaArrowLeft, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

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
    const [previewUrl, setPreviewUrl] = useState(null);
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
            setEditedData({
                username: response.data.username,
                bio: response.data.bio || ''
            });
        } catch (error) {
            setError('Ошибка при загрузке данных пользователя');
            console.error('Error:', error);
        } finally {
            setLoading(false);
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
            setPreviewUrl(URL.createObjectURL(file));
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
            setPreviewUrl(null);
            
            const timestamp = new Date().getTime();
            setUserData({
                ...userData,
                avatar: `http://127.0.0.1:8000/auth/avatar?t=${timestamp}`
            });

            await fetchUserData();
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Ошибка при загрузке аватара');
        }
    };

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

            setUserData({ 
                ...userData, 
                [field]: editedData[field] 
            });
            setEditMode({ ...editMode, [field]: false });

            await fetchUserData();
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`Ошибка при обновлении ${field === 'username' ? 'имени пользователя' : 'информации о себе'}`);
        }
    };

    const cancelEdit = (field) => {
        setEditedData({ ...editedData, [field]: userData[field] || '' });
        setEditMode({ ...editMode, [field]: false });
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
                    <div className={styles.avatarWrapper}>
                        <img 
                            src={previewUrl || (userData.avatar ? 
                                `http://127.0.0.1:8000/auth/avatar?t=${new Date().getTime()}` : 
                                'https://api.dicebear.com/7.x/avataaars/svg')} 
                            alt="Аватар пользователя" 
                            className={styles.avatar}
                        />
                        <label className={styles.avatarUploadLabel}>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleFileSelect}
                                className={styles.fileInput}
                            />
                            <FaEdit className={styles.editIcon} />
                        </label>
                    </div>
                    {selectedFile && (
                        <div className={styles.avatarActions}>
                            <button 
                                onClick={handleAvatarUpload}
                                className={styles.saveButton}
                            >
                                Сохранить фото
                            </button>
                            <button 
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                }}
                                className={styles.cancelButton}
                            >
                                Отменить
                            </button>
                        </div>
                    )}
                </div>

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
                                <div className={styles.editActions}>
                                    <FaCheck
                                        className={styles.actionIcon}
                                        onClick={() => handleUpdate('username')}
                                    />
                                    <FaTimes
                                        className={styles.actionIcon}
                                        onClick={() => cancelEdit('username')}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className={styles.displayField}>
                                <span>{userData.username}</span>
                                <FaEdit
                                    className={styles.editIcon}
                                    onClick={() => setEditMode({
                                        ...editMode,
                                        username: true
                                    })}
                                />
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
                                    rows={5}
                                    maxLength={1000}
                                />
                                <div className={styles.editActions}>
                                    <button 
                                        onClick={() => handleUpdate('bio')}
                                        className={styles.saveButton}
                                    >
                                        Сохранить
                                    </button>
                                    <button 
                                        onClick={() => cancelEdit('bio')}
                                        className={styles.cancelButton}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.displayField}>
                                <p className={styles.bioText}>
                                    {userData.bio || 'Пользователь еще не добавил информацию о себе'}
                                </p>
                                <FaEdit
                                    className={styles.editIcon}
                                    onClick={() => setEditMode({
                                        ...editMode,
                                        bio: true
                                    })}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 