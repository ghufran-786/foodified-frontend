import React from "react";
import FoodItems from "../components/FoodItems";
import CartPage from "../CartPage";

const Home = () => {
  return (
    <div className="w-full min-h-screen" style={{backgroundColor: 'var(--bg-warm)'}}>
      <FoodItems />
      <CartPage />
    </div>
  );
};

export default Home;
