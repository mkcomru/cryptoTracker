import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Auth.module.css';
import axios from 'axios';

const LoginForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = 'Введите имя пользователя';
        if (!formData.password) newErrors.password = 'Введите пароль';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const formDataLogin = new FormData();
            formDataLogin.append('username', formData.username);
            formDataLogin.append('password', formData.password);
            
            const response = await axios.post('http://127.0.0.1:8000/auth/token', 
                formDataLogin,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            localStorage.setItem('token', response.data.access_token);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setErrors({ 
                submit: error.response?.data?.detail || 
                    'Неверное имя пользователя или пароль' 
            });
        }
    };

    return (
        <form className={styles.authForm} onSubmit={handleSubmit}>
            <h2>Вход</h2>
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
                    type="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={errors.password ? styles.errorInput : ''}
                />
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
            {errors.submit && <span className={styles.errorText}>{errors.submit}</span>}
            <button type="submit">Войти</button>
        </form>
    );
};

LoginForm.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default LoginForm; 