import React, { useEffect } from "react";
import style from "./orders.module.css";
import {
  fetchOrdersThunk,
  ordersSelector,
  removeOrderThunk,
} from "../../Reducers/Orders/OrderReducer";
import { useSelector, useDispatch } from "react-redux";

function Orders({ setMsg }) {
  const dispatch = useDispatch();
  const orders = useSelector(ordersSelector);
  const allOrders = orders.orderItems;

  // use useEffect to fetch All Orders on Orders Page
  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  // if orders req. is pending then then show this msg
  if (orders.msg === "pending") {
    return <h1>Loading...</h1>;
  }

  // handle remove item from Cart
  const deleteOrderFromOrders = (id) => {
    dispatch(removeOrderThunk(id));
    setMsg("Item Removed Successfully");
  };

  // return JSX
  return (
    <>
      <div className={style.orders}>
        {allOrders.length > 0 ? (
          allOrders.map((item, i) => (
            <div key={i} className={style.showOrders}>
              <div className={style.imgs}>
                <img src={item.img} alt="" />
              </div>
              <div className={style.orderInfo}>
                <h2>{item.title}</h2>

                <h3>
                  price: {item.quantity}x{item.price} ={" "}
                  {item.quantity * item.price}
                </h3>
                <div className={style.removeBtn}>
                  <button onClick={() => deleteOrderFromOrders(item.id)}>
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2>No Orders here</h2>
        )}
      </div>
    </>
  );
}

export default Orders;
