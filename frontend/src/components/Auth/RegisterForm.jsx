import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Auth.module.css';
import axios from 'axios';

const RegisterForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Введите имя пользователя';
        if (!formData.email.trim()) newErrors.email = 'Введите email';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Неверный формат email';
        if (!formData.password) newErrors.password = 'Введите пароль';
        else if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await axios.post('http://127.0.0.1:8000/auth/register', formData);
            
            // Создаем FormData для авторизации
            const formDataLogin = new FormData();
            formDataLogin.append('username', formData.username);
            formDataLogin.append('password', formData.password);
            
            // Отправляем запрос на авторизацию
            const loginResponse = await axios.post('http://127.0.0.1:8000/auth/token', 
                formDataLogin,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            localStorage.setItem('token', loginResponse.data.access_token);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setErrors({ 
                submit: error.response?.data?.detail || 
                    'Ошибка регистрации. Возможно, пользователь уже существует.' 
            });
        }
    };

    return (
        <form className={styles.authForm} onSubmit={handleSubmit}>
            <h2>Регистрация</h2>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className={errors.username ? styles.errorInput : ''}
                />
                {errors.username && <span className={styles.errorText}>{errors.username}</span>}
            </div>
            <div className={styles.inputGroup}>
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={errors.email ? styles.errorInput : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            <div className={styles.inputGroup}>
                <input
                    type="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={errors.password ? styles.errorInput : ''}
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
            {errors.submit && <span className={styles.errorText}>{errors.submit}</span>}
            <button type="submit">Зарегистрироваться</button>
        </form>
    );
};

RegisterForm.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default RegisterForm; 