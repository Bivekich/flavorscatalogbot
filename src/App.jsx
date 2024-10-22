import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Card from "./components/Card/Card";
import Cart from "./components/Cart/Cart";
import OrderForm from "./components/OrderForm/OrderForm";

import { getData } from "./db/db";
const foods = getData();

const TELEGRAM_BOT_TOKEN = "7344601477:AAEhACIFDUIg-aorq829R0X1lKAg7g5WpAI"; // Updated bot token
const TELEGRAM_CHAT_ID = "-4545329962";

const Telegram = window.Telegram.WebApp;

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
    setShowForm(true);
  };

  const sendData = (formData, chatId) => {
    axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: `Новый заказ!\nИмя: ${formData.name}\nПримечание к заказу: ${
          formData.description
        }\nГород: ${formData.city}\n\nТовары: ${cartItems
          .map((item) => `${item.title} (Количество: ${item.quantity})`)
          .join(", ")}`,
      }
    );
  };
  const handleFormSubmit = (formData) => {
    console.log("Отправить заказ:", formData, cartItems);

    const chatId =
      formData.city === "Иваново"
        ? ["-4594175705", "-1002324858845"]
        : TELEGRAM_CHAT_ID;

    if (typeof chatId == "object") {
      chatId.map((item) => {
        sendData(formData, item);
      });
    } else {
      sendData(formData, chatId);
    }

    const data = {
      products: cartItems,
    };
    try {
      axios.post("https://flavorscatalogbot.ru/web-data", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
    setCartItems([]);
  };

  const handleFormClose = () => {
    setShowForm(false);
    Telegram.close();
  };

  const filteredFoods = selectedCategory
    ? foods.filter((food) => food.category === selectedCategory)
    : foods;

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
        <button onClick={() => setSelectedCategory("Розница")}>Розница</button>
        <button onClick={() => setSelectedCategory("Опт")}>Опт</button>
        <button onClick={() => setSelectedCategory("Сет")}>Сеты</button>
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

export default App;
