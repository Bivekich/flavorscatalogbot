import React, {useState} from 'react';
import './OrderForm.css';
import Button from "../Button/Button";

function OrderForm({onSubmit, onClose}) {
    const [formData, setFormData] = useState({
        name: '', description: '', city: '' 
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData, [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); 
        setFormData({
            name: '', description: '', city: '' 
        });
        setSubmitted(true)
    };

    return (<div className="modal-overlay">
        <div className="modal-content">
            {submitted ? (<div className='success-message'>
                <span>Ваш заказ успешно создан!</span>
                <Button title={'Закрыть'} type={'add'} onClick={onClose}/>
            </div>) : (
                <div>
                    <h1 className='form-title'>Оформление заказа</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" name='name' value={formData.name} onChange={handleChange}
                                   placeholder='Имя'
                                   required/>
                        </div>
                        <div className="form-group">
                            <input type="text" name='description' value={formData.description} onChange={handleChange}
                                   placeholder='Примечание к заказу' required/>
                        </div>
                        <div className="form-group">
                            <select name='city' value={formData.city} onChange={handleChange} required>
                                <option value=''>Выберите город</option>
                                <option value='Иваново'>Иваново</option>
                                <option value='Ярославльг'>Ярославль</option>
                            </select>
                        </div>
                        <button className='submit-button' type='submit'>Оформить заказ</button>
                    </form>
                </div>
            )}
        </div>
        </div>
    )
        ;
}

export default OrderForm;
