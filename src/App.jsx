import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Card from './components/Card/Card'
import Cart from './components/Cart/Cart'
import OrderForm from './components/OrderForm/OrderForm'

import { getData } from './db/db'
const foods = getData()

const TELEGRAM_BOT_TOKEN = '6757073330:AAFtn6evlg50y9F70ncomVXWlikDF6LhKLk'
const TELEGRAM_CHAT_ID = '5379725422'

const Telegram = window.Telegram.WebApp

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    Telegram.ready();
  });

  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  const onCheckout = () => {
    setShowForm(true)
  };

  const handleFormSubmit = (formData) => {
    console.log('Отправить заказ:', formData, cartItems);
    axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: `Новый заказ!\nИмя: ${formData.name}\nПримечание к заказу: ${formData.description}\n\nТовары: ${cartItems.map(item => `${item.title} (Количество: ${item.quantity})`).join(', ')}`
    })
    const data = {
      products: cartItems,
      queryId: 1,
    };
    axios.post('http://localhost:8000/web-data', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setCartItems([])
  }

  const handleFormClose = () => {
    setShowForm(false)
    Telegram.close()
  }

  const filteredFoods = selectedCategory ? foods.filter(food => food.category === selectedCategory) : foods

  return (
    <>
      <h1 className="heading">Каталог вкусов</h1>
      {showForm ? (
        <OrderForm onSubmit={handleFormSubmit} onClose={handleFormClose} />
      ) : (
        <Cart cartItems={cartItems} onCheckout={onCheckout} />
      )}

      <div className="category__buttons">
        <button onClick={() => setSelectedCategory(null)}>Все</button>
        <button onClick={() => setSelectedCategory('Мясо')}>Мясо</button>
        <button onClick={() => setSelectedCategory('Мясные сеты')}>Мясные сеты</button>
        <button onClick={() => setSelectedCategory('Другое')}>Другое</button>
      </div>

      <div className="cards__container">
        {filteredFoods.map((food) => {
          return (
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
          );
        })}
      </div>
    </>
  );
}

export default App