import React, { useContext, useRef } from "react";
import { FirebaseContext } from "../../firebase";
const FoodItem = ({ fitem }) => {
  const availableRef = useRef(fitem.existence);
  const { firebase } = useContext(FirebaseContext);
  const availabilityStatus = () => {
    const existence = availableRef.current.value === "true";

    try {
      firebase.db.collection("products").doc(fitem.id).update({
        existence,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full px-3 mb-4">
      <div className="p-5 shadow-md bg-white">
        <div className="lg:flex">
          <div className="lg:w-5/12 xl:w-3/12">
            <img src={fitem.image} alt=" image missing " />
            <div className="sm:flex sm:-mx-2 pl-2">
              <label className="block mt-5 sm:w-2/4">
                <span className="block text-gray-800 mb-2 ">available</span>
                <select
                  className="bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline  "
                  value={fitem.existence}
                  ref={availableRef}
                  onChange={() => availabilityStatus()}
                >
                  <option value="true">Display</option>
                  <option value="false">Hide</option>
                </select>
              </label>
            </div>
          </div>
          <div className="lg:w-7/12 xl:w-9/12 pl-5">
            <p className="font-bold text-2xl text-yellow-600 mb-4">
              {fitem.name}{" "}
            </p>
            <p className="text-gray-600 mb-4">
              Category: {""}
              <span className="text-gray-700 font-bold">
                {fitem.category.toUpperCase()}
              </span>
            </p>
            <p className="text-gray-600 mb-4">{fitem.description} </p>

            <p className="text-gray-600 mb-4">
              Price: {""}
              <span className="text-gray-700 font-bold">£{fitem.price}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
