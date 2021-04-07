import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import FoodItem from "../ui/FoodItem";
const Menu = () => {
  const [foodItems, setFoodItems] = useState([]);
  console.log(foodItems);
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const getItems = () => {
      //
      firebase.db.collection("products").onSnapshot(handleSnapshot);
    };
    getItems();
  }, []);
  function handleSnapshot(snapshot) {
    const dishItems = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setFoodItems(dishItems);
  }

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Menu</h1>
      <Link
        to="/newdish"
        className=" bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold"
      >
        Add New Dish
      </Link>
      {foodItems.map((fitem) => (
        <FoodItem key={fitem.id} fitem={fitem} />
      ))}
    </>
  );
};

export default Menu;
