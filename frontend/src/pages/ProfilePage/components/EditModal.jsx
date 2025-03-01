import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import styles from './EditModal.module.css';

const EditModal = ({ user, onClose, onSave }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            lastName: user.lastName,
            firstName: user.firstName,
            middleName: user.middleName,
            phone: user.phone,
            email: user.email || '',
            bio: user.bio
        }
    });

    const onSubmit = (data) => {
        onSave(data);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Редактировать профиль</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.field}>
                        <label>Фамилия</label>
                        <input {...register('lastName', { required: 'Обязательное поле' })} />
                        {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
                    </div>

                    <div className={styles.field}>
                        <label>Имя</label>
                        <input {...register('firstName', { required: 'Обязательное поле' })} />
                        {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                    </div>

                    <div className={styles.field}>
                        <label>Отчество</label>
                        <input {...register('middleName')} />
                    </div>

                    <div className={styles.field}>
                        <label>Телефон</label>
                        <input {...register('phone', { required: 'Обязательное поле' })} />
                        {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
                    </div>

                    <div className={styles.field}>
                        <label>Email</label>
                        <input {...register('email', {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Неверный формат email'
                            }
                        })} />
                        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                    </div>

                    <div className={styles.field}>
                        <label>О себе</label>
                        <textarea {...register('bio')} rows={4} />
                    </div>

                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Отмена</button>
                        <button type="submit" className={styles.saveButton}>Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditModal.propTypes = {
    user: PropTypes.shape({
        lastName: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        middleName: PropTypes.string,
        phone: PropTypes.string.isRequired,
        email: PropTypes.string,
        bio: PropTypes.string
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default EditModal;