import Img1 from "/images/1.jpg";
import Img2 from "/images/2.jpg";
import Img3 from "/images/3.jpg";
import Img4 from "/images/4.jpg";
import Img5 from "/images/5.png";
import Img6 from "/images/6.png";

export function getData() {
  return [
    { title: "Перепел", category: 'Мясо', price: 180, image: Img1, id: 1 },
    { title: "Цыпленок корнишен", category: 'Мясо', price: 330, image: Img2, id: 2 },
    { title: "Цыпленок корнишен 700+ гр.", category: 'Мясные сеты', price: 350, image: Img3, id: 3 },
    { title: "Кура дер", category: 'Мясо', price: 350, image: Img4, id: 4 },
    { title: "Крылья дом кур (цена за 1 кг.)", category: 'Мясо', price: 450, image: Img5, id: 5 },
    { title: "Цыпленок копченый доминант 350+ гр. (цена за 1 шт.)", category: 'Мясные сеты', price: 450, image: Img6, id: 6 },
  ];
}
