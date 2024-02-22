import React, { useEffect } from "react";
import style from "./cartPage.module.css";
import {
  cartSelector,
  fetchCartitemsThunk,
  removeCartItem,
  increaseCartCount,
  decreaseCartCount,
} from "../../Reducers/cart/CartReducer";

import { addOrdersThunk } from "../../Reducers/Orders/OrderReducer";
import { totalThunk } from "../../Reducers/cart/CartReducer";

import { useDispatch, useSelector } from "react-redux";

function CartPage({ setMsg }) {
  const dispatch = useDispatch();
  const data = useSelector(cartSelector);
  const itemsData = data.cartItems || <h1>No Items here</h1>;
  const Total = data.total;

  // use useEffect to disatch totalPrice
  useEffect(() => {
    dispatch(totalThunk());
  }, [dispatch]);

  // use useEffect to dispatch allCart items
  useEffect(() => {
    dispatch(fetchCartitemsThunk());
  }, [dispatch]);

  // it works when req. is pending
  if (data.msg === "pending") {
    return <h1>Loading...</h1>;
  }

  // handle the addOrder action
  const handleAddOrder = (item) => {
    dispatch(addOrdersThunk(item));
    setMsg("Successfully Ordered item");
  };

  // handle remove item form Cart
  const handleRemoveFromCart = (id) => {
    dispatch(removeCartItem(id));
    setMsg("Item Delete SuccessFully");
  };

  // return JSX
  return (
    <>
      <div className={style.cartItems}>
        {itemsData.length > 0 ? (
          itemsData.map((item, i) => {
            return (
              <div key={i} className={style.showItems}>
                <div className={style.image}>
                  <img src={item.img} alt="img" />
                </div>
                <div className={style.itemInfo}>
                  <h2>
                    {item.title.length > 15
                      ? item.title.slice(0, 15) + "..."
                      : item.title}
                  </h2>
                  <div className={style.prices}>
                    <h3>Rs. {item.price}</h3>
                    <div className={style.quantity}>
                      <img
                        onClick={() => dispatch(decreaseCartCount(item.id))}
                        src="https://cdn-icons-png.flaticon.com/128/1828/1828899.png"
                        alt="-"
                      />
                      {item.quantity}
                      <img
                        onClick={() => dispatch(increaseCartCount(item.id))}
                        src="https://cdn-icons-png.flaticon.com/128/1828/1828919.png"
                        alt="+"
                      />
                    </div>
                  </div>
                  <div className={style.btns}>
                    <button
                      className={style.buy}
                      onClick={() => handleAddOrder(item)}
                    >
                      Buy Now
                    </button>
                    <button
                      className={style.remove}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove item
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h2>No Cart items here</h2>
        )}
      </div>
      <div className={style.totalPrices}>
        <h2>Total Price</h2>
        <h2>Rs. {Total}</h2>
      </div>
    </>
  );
}

export default CartPage;
