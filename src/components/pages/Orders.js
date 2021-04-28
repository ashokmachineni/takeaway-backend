import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { firebase } = useContext(FirebaseContext);
  const getItems = () => {
    firebase.db
      .collection("orders")
      .orderBy("orderDate", "desc")
      .onSnapshot(handleSnapshot);
  };
  useEffect(() => {
    getItems();
  }, []);
  function handleSnapshot(snapshot) {
    const orderItems = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    setOrders(orderItems);
  }

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Orders</h1>
      <Link
        to="/newOrder"
        className=" bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold"
      >
        Enter Telephone Order
      </Link>
      {orders.map((order) => (
        <div className="mb-2 border border-width-1 border-color-3 borders-radius-0">
          <div className="border-bottom border-color-1 px-2 py-2 d-flex">
            <div className="flex-grow-1">
              <h3 className="m-0 p-0 ">Order #{order.orderID}</h3>

              <p className="m-0 p-0">Name: {order.name}</p>
              <p className="m-0 p-0">Email: {order.email}</p>
            </div>
          </div>
          <div className="table-container p-2">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th width={80}>&nbsp;</th>
                  <th align="left">Product</th>
                  <th align="right">Price</th>
                  <th align="right">Qty</th>
                  <th align="right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item, i) => (
                  <tr className="">
                    <td className="width-75">
                      <img
                        className="img-fluid w-100 border border-color-1"
                        src={item.image}
                        alt="Description"
                      />
                    </td>

                    <td>
                      <div>
                        <p className="font-weight-bold m-0 p-0">{item.name}</p>
                      </div>
                    </td>

                    <td align="right">£{item.price}</td>
                    <td align="right">{item.qty}</td>
                    <td align="right">£{item.price * item.qty}</td>
                  </tr>
                ))}
                <tr className="">
                  <td colSpan="4" align="right">
                    Total:
                  </td>
                  <td align="right">£{order.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
};

export default Orders;
