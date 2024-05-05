import React, {useState} from 'react';
import './Modal.css'

function Modal({onClose, food}) {
    const {title, image, price, description} = food
    const [currentImage, setCurrentImage] = useState(0)
    
    const nextImage = () => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % image.length)
    }
    
    const prevImage = () => {
      setCurrentImage((prevIndex) => (prevIndex - 1 + image.length) % image.length)
    }

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close-btn" onClick={onClose}>×</button>
                <div className="image__container">
                    <img src={image[currentImage]} alt={title}/>
                    {image.length > 1 && (
                        <div className="image__nav">
                            <button onClick={prevImage}>&lt;</button>
                            <button onClick={nextImage}>&gt;</button>
                        </div>
                    )}
                </div>
                <h2>{title}</h2>
                <p>{description}</p>
                <p>{price} руб.</p>

            </div>
        </div>
    )
}

export default Modal