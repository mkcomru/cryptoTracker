import UserAvatar from './components/UserAvatar';
import UserInfo from './components/UserInfo';
import UserBio from './components/UserBio';
import UserRating from './components/UserRating';
import styles from './ProfilePage.module.css';
import ProfileImage from '../../img/1387268.png'
import EditModal from './components/EditModal';
import { useState } from 'react';
import {FaArrowLeft} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  // Mock user data (replace with real data later)
    const [user, setUser] = useState({
        avatar: ProfileImage,
        lastName: 'Гребенщиков',
        firstName: 'Максим',
        middleName: 'Юрьевич',
        age: 19,
        phone: '+7 (963) 848-71-65',
        email: 'maksim@example.com',
        bio: 'Активный участник волонтерского движения. Люблю помогать людям и делать мир лучше.',
        rating: 5.0
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSafe = (updatedData) => {
        setUser({ ...user, ...updatedData });
    };

    const handleAvatarChange = (newAvatarUrl) => {
        setUser({ ...user, avatar: newAvatarUrl });
    }

    const navigate = useNavigate();
    const goToPage = () => {
        navigate(-1);
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.mainContent}>
                <div className={styles.leftSection}>
                    <UserAvatar src={user.avatar} onAvatarChange={handleAvatarChange} />
                </div>
                <div className={styles.rightSection}>
                    <UserInfo user={user} />
                </div>
            </div>
            <div className={styles.bottomSection}>
                <UserBio bio={user.bio} />
                <div className={styles.ratingSection}>
                    <UserRating rating={user.rating} />
                    <button className={styles.editButton} onClick={() => setIsEditModalOpen(true)}>Редактировать</button>
                    <button className={styles.backbtn} onClick={goToPage}>
                        <FaArrowLeft />
                    </button>
                </div>
            </div>
            {isEditModalOpen && (
                <EditModal 
                    user={user}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSafe}
                />
            )}
        </div>
    );
};

export default ProfilePage;