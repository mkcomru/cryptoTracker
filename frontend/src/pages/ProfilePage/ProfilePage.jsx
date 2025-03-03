import UserAvatar from './components/UserAvatar';
import UserInfo from './components/UserInfo';
import UserBio from './components/UserBio';
import styles from './ProfilePage.module.css';
import EditModal from './components/EditModal';
import { useState, useEffect } from 'react';
import {FaArrowLeft} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        avatar: null
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:8000/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(response.data);
            setError(null);

            if (response.data.has_avatar) {
                try {
                    const avatarResponse = await axios.get('http://127.0.0.1:8000/auth/avatar', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        responseType: 'blob'
                    });

                    if (avatarResponse.data) {
                        const avatarUrl = URL.createObjectURL(avatarResponse.data);
                        setUserData(prevUser => ({
                            ...prevUser,
                            avatar: avatarUrl
                        }));
                    }
                } catch (avatarError) {
                    console.error('Error fetching avatar:', avatarError);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError('Ошибка при загрузке данных пользователя');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSafe = async (updatedData) => {
        try {
            setUserData(prevUser => ({
                ...prevUser,
                ...updatedData
            }));
            
            await fetchUserData();
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    const handleAvatarChange = async (newAvatarUrl) => {
        try {
            if (newAvatarUrl && typeof newAvatarUrl === 'string') {
                const fullAvatarUrl = newAvatarUrl.startsWith('http') 
                    ? newAvatarUrl 
                    : `${import.meta.env.VITE_API_URL}${newAvatarUrl}`;
                
                setUserData(prevUser => ({
                    ...prevUser,
                    avatar: fullAvatarUrl
                }));

                await fetchUserData();
            }
        } catch (error) {
            console.error('Failed to update avatar:', error);
        }
    };

    const navigate = useNavigate();
    const goToPage = () => {
        navigate(-1);
    }

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.mainContent}>
                <div className={styles.leftSection}>
                    <UserAvatar 
                        src={userData.has_avatar ? userData.avatar : 'https://api.dicebear.com/7.x/avataaars/svg'} 
                        onAvatarChange={handleAvatarChange} 
                    />
                </div>
                <div className={styles.rightSection}>
                    <UserInfo userData={userData} />
                </div>
            </div>
            <div className={styles.bottomSection}>
                <UserBio bio={userData.bio} />
                <div className={styles.ratingSection}>
                    <button className={styles.editButton} onClick={() => setIsEditModalOpen(true)}>Редактировать</button>
                    <button className={styles.backbtn} onClick={goToPage}>
                        <FaArrowLeft />
                    </button>
                </div>
            </div>
            {isEditModalOpen && (
                <EditModal 
                    userData={userData}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSafe}
                />
            )}
        </div>
    );
};

export default ProfilePage;