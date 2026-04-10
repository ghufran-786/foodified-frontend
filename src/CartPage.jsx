import React, { useContext } from 'react'
import { RxCross2 } from "react-icons/rx";
import { dataContext } from './UserContext';
import CartItems from './CartItems';

const CartPage = () => {
    let {showCart, setShowCart} = useContext(dataContext);
  return (
    <>
      {showCart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setShowCart(false)}
        />
      )}
      <div className={`w-full md:w-[40vw] h-full fixed top-0 right-0 shadow-xl transition-all duration-800 ease-in-out z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'}`} style={{backgroundColor: 'var(--bg-warm)'}}>
        <header className='w-full flex items-center justify-between p-5 border-b flex-wrap gap-3' style={{borderColor: 'var(--border-light)', backgroundColor: 'white'}}>
            <span className='text-xl font-semibold' style={{color: 'var(--coral-primary)'}}>Order Items</span>
            <RxCross2 
              onClick={() => setShowCart(false)} 
              className='w-8 h-8 text-xl font-bold cursor-pointer transition-all duration-300 hover:scale-110'
              style={{color: 'var(--coral-primary)'}}
            />
        </header>
        <CartItems />
      </div>
    </>
  )
}

export default CartPage