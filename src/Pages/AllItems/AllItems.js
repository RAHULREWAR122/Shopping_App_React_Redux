import React, { useState } from "react";
import style from "./allItems.module.css";
import Data from "../../Data/data";
import { addToCartThunk } from "../../Reducers/cart/CartReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Component for displaying all items
function AllItems({ isAuth, setMsg }) {
  // State variables using useState hook
  const [priceRange, setPriceRange] = useState(6999); // State for price range
  const [searchItem, setSearchItems] = useState(""); // State for search input
  const [chosenCategory, setCategory] = useState(""); // State for selected category

  const dispatch = useDispatch(); // Redux dispatch function
  const data = Data; // Dummy data

  // Function to handle price range change
  const handlePrice = (e) => {
    setPriceRange(e.target.value);
  };

  // Function to handle category selection
  const handleCategory = (category) => {
    setCategory(category);
  };

  // Function to handle displaying all categories
  const handleAllCategory = () => {
    setCategory("");
  };

  // Function to handle search input change
  const handleSearchItem = (e) => {
    setSearchItems(e.target.value);
  };

  // Filtering data based on price range, category, and search input
  const filteredData = data.filter((item) => {
    const priceCondition = item.price <= priceRange;
    const searchCategory = chosenCategory
      ? item.category === chosenCategory
      : item.category;
    const searchItemByTitle =
      item.title.toLowerCase().includes(searchItem.toLowerCase()) ||
      !searchItem;
    return priceCondition && searchCategory && searchItemByTitle;
  });

  const navigate = useNavigate(); // Navigation hook

  // Function to handle adding items to the cart
  const handleAddToCart = (item) => {
    if (isAuth) {
      setMsg("Item Added Successfully");
      dispatch(addToCartThunk(item));
    } else {
      navigate("/signIn");
      setMsg("Please login.");
    }
  };

  // JSX for rendering
  return (
    <>
      <div className={style.searchInput}>
        <input
          type="text"
          value={searchItem}
          onChange={handleSearchItem}
          placeholder="Search here..."
        />
      </div>
      <div className={style.main}>
        <div className={style.sideBar}>
          <div className={style.pricerange}>
            <input
              type="range"
              value={priceRange}
              onChange={handlePrice}
              min={199}
              max={15999}
            />
            <strong>Rs. {priceRange}</strong>
          </div>
          <hr />
          <div className={style.categoryBtns}>
            <button onClick={() => handleAllCategory("")}>All</button>
            <button onClick={() => handleCategory("Clothes")}>Clothes</button>
            <button onClick={() => handleCategory("furniture")}>
              Furniture
            </button>
            <button onClick={() => handleCategory("Electric")}>Electric</button>
            <button onClick={() => handleCategory("Jewelery")}>Jewelry</button>
          </div>
        </div>
        <div className={style.allItems}>
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => {
              return (
                <div key={item.id} className={style.showItems}>
                  <div className={style.img}>
                    <img src={item.img} alt="" />
                  </div>
                  <div className={style.info}>
                    <h4>{item.title}</h4>
                    <h3>Rs. {item.price}</h3>
                  </div>
                  <button onClick={() => handleAddToCart(item)}>
                    Add to cart
                  </button>
                </div>
              );
            })
          ) : (
            <h1 style={{ fontFamily: "cursive" }}>Item not Available</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default AllItems;
