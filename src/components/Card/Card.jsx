import React, { useState } from 'react'
import './Card.css'
import Button from '../Button/Button'
import Modal from "../Modal/Modal.jsx";

function Card({ food, onAdd, onRemove, onCheckout }) {
    const [count, setCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { title, image, price, id } = food;

    const handleIncrement = () => {
        setCount(count + 1);
        onAdd(food);
    };
    const handleDecrement = () => {
        setCount(count - 1);
        onRemove(food);
    };

    const openModal = () => {
      setIsModalOpen(true)
    }
    
    const closeModal = () => {
      setIsModalOpen(false);
    }

    return (
        <>
            <div className="card">
            <span
                className={`${count !== 0 ? "card__badge" : "card__badge--hidden"}`}
            >
                {count}
            </span>
                <div className="image__container" onClick={openModal}>
                    <img src={image[0]} alt={title}/>
                </div>
                <span className="card__price">{price} руб.</span>
                <h6 className="card__title">
                    {title}
                </h6>

                <div className="btn-container">
                    <Button title={"+"} type={"add"} onClick={handleIncrement}/>
                    {count !== 0 ? (
                        <Button title={"-"} type={"remove"} onClick={handleDecrement}/>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            {isModalOpen && (
                <Modal food={food} onClose={closeModal}/>
            )}
        </>
    );
}

export default Card;