import React, { useState } from 'react';
import './OrderForm.css';

function OrderForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            name: '',
            description: ''
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h1 className='form-title'>Оформление заказа</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Имя:</label>
                        <input type="text" name='name' value={formData.name} onChange={handleChange} placeholder='Имя' required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Примечание к заказу:</label>
                        <input type="text" name='description' value={formData.description} onChange={handleChange} placeholder='Примечание к заказу' required />
                    </div>
                    <button className='submit-button' type='submit'>Оформить заказ</button>
                </form>
            </div>
        </div>
    );
}

export default OrderForm;
