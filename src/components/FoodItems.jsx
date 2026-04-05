import React from "react";
import { food_items } from "../food";
import FoodCard from "./FoodCard";
import Category from "../Category";
import Nav from "./Nav";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const FoodItems = () => {
  let [cate, setCate] = useState(food_items);
  let [input, setInput] = useState("");

  useEffect(() => {
    let newList = food_items.filter((item) =>
      item.food_name.toLowerCase().includes(input.toLowerCase()),
    );
    setCate(newList);
  }, [input]);

  function filterCategory(category) {
    if (category.toLowerCase() === "all") {
      setCate(
        food_items.filter((item) =>
          item.food_name.toLowerCase().includes(input.toLowerCase()),
        ),
      );
    } else {
      let updatedItems = food_items.filter(
        (item) =>
          item.food_category === category.toLowerCase() &&
          item.food_name.toLowerCase().includes(input.toLowerCase()),
      );
      setCate(updatedItems);
    }
  }

  let items = useSelector((state) => state.cart.itemsList);
  return (
    <div className="w-full">
      <Nav input={input} setInput={setInput} />
      {input === "" && <Category filterCategory={filterCategory} />}
      <div className="w-full flex flex-wrap justify-center items-center gap-5 pt-8 px-5 pb-8" style={{backgroundColor: 'var(--bg-warm)'}}>
        {cate.map((item) => (
          <FoodCard
            key={item.id}
            name={item.food_name}
            image={item.food_image}
            id={item.id}
            price={item.price}
            type={item.food_type}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodItems;
