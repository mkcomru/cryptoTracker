import { useState } from 'react';
import axios from 'axios';
import ImeiCheck from '../../components/ImeiCheck/ImeiCheck';
import Modal from '../../components/Modal/Modal';
import Logo from '../../components/Logo/Logo';
import styles from './ImeiCheckPage.module.css';

const ImeiCheckPage = () => {
    const [imei, setImei] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImeiChange = (e) => {
        setImei(e.target.value);
    };

    const validateIMEI = (imei) => {
        if (imei.length !== 15 || !/^\d+$/.test(imei)) {
            return false;
        }

        let sum = 0;
        let shouldDouble = false;

        for (let i = 0; i < 14; i++) {
            let digit = parseInt(imei[i], 10);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        const checkDigit = (10 - (sum % 10)) % 10;
        return checkDigit === parseInt(imei[14], 10);
    };

    const handleCheckImei = () => {
        if (!validateIMEI(imei)) {
            setModalMessage('Неверный формат IMEI');
            setIsModalOpen(true);
            return;
        }
        
        setIsLoading(true);
        axios.post(`http://127.0.0.1:8000/imei/${imei}`)
            .then(response => {
                setModalMessage(response.data.message);
                setIsModalOpen(true);
                setImei('');
            })
            .catch(error => {
                setModalMessage('Ошибка при проверке IMEI: ' + error.message);
                setIsModalOpen(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            {isLoading ? (
                <Logo />
            ) : (
                <div className={styles.content}>
                    <ImeiCheck onImeiChange={handleImeiChange} onCheckImei={handleCheckImei} />
                    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                        {modalMessage}
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default ImeiCheckPage;