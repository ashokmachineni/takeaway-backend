import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase";
import { useHistory } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as emailjs from "emailjs-com";
import { Button, Table } from "react-bootstrap";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SelectProduct from "../ui/SelectProduct";

const NewOrder = () => {
  //state for uploading
  const [uploading, setUploading] = useState(false);
  const [progres, setProgres] = useState(0);
  const [imageLink, setImageLink] = useState("");
  //for context
  const { firebase } = useContext(FirebaseContext);

  const [showModal, setShowModal] = useState(false);

  const clickorderProducts = () => {
    setShowModal(true);
  };
  const hideorderProducts = () => {
    setShowModal(false);
  };

  const [foodItems, setFoodItems] = useState([]);

  const [total, setTotal] = useState(0);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);

  const SERVICE_ID = "service_13td4o7";
  const TEMPLATE_ID = "template_or8rxkl";
  const USER_ID = "user_562kLwHNb0P0M4f7VgI3B";

  const changeQuantity = async (index, count) => {
    var items = [...orderProducts];
    if (items[index].qty >= 1 && count > 0) {
      items[index].qty = count;
      setOrderProducts(items);
    }
  };

  const removeProduct = async (name) => {
    setOrderProducts(orderProducts.filter((item) => item.name !== name));
  };

  const calculateTotal = async () => {
    var tot = 0;
    orderProducts.map((item) => {
      tot = tot + item.price * item.qty;
    });
    setTotal(tot);
    console.log(tot);
  };

  function sendEmail(orderID) {
    console.log(email);
    var data = {
      send_to: email,
      to_name: name,
      message: `Your order ID is ${orderID}, with the bill of £${total}`,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, data, USER_ID).then(
      function (response) {
        console.log(response.status, response.text);
      },
      function (err) {
        console.log(err);
      }
    );
  }
  const history = useHistory();

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!name || !email || !orderProducts || orderProducts?.length < 1) {
      console.log("error");
    } else {
      const orderID =
        "ORDER" +
        Math.floor(Math.random() * 1000000)
          .toString(36)
          .toUpperCase();
      const data = {
        orderID: orderID,
        products: orderProducts,
        name: name,
        email: email,
        amount: total,
        orderDate: new Date(),
      };
      await firebase.db
        .collection("orders")
        .add(data)
        .then((doc) => {
          if (doc.id) {
            setOrderProducts([]);
            setName(null);
            setEmail(null);
            // handleClose();
            history.push("/");

            sendEmail(orderID);
          }
        });
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [orderProducts]);

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
      <h1 className="text-3xl font-light mb-4">New Order</h1>
      <div className="flex justify-center mt-10">
        <div className="max-w-3xl w-full">
          <form onSubmit={placeOrder}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Customer Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="Enter Email"
                min="0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <SelectProduct
              foodItems={foodItems}
              handleClose={hideorderProducts}
              show={showModal}
              orderProduct={orderProducts}
              setOrderProduct={setOrderProducts}
            />

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th width="50"></th>
                  <th>#</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderProducts?.map((item, index) => (
                  <tr>
                    <td>
                      <Button
                        className="px-2 ml-1 py-1"
                        size="sm"
                        variant="danger"
                        onClick={() => removeProduct(item.name)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </td>
                    <td width={80} className="p-1">
                      <img className="img-fluid" src={item.image} />
                    </td>
                    <td>{item.name}</td>
                    <td className="d-flex">
                      {item.qty}
                      <div className="flex-grow-1" />
                      <Button
                        className="px-2 ml-1 py-1"
                        size="sm"
                        variant="info"
                        onClick={() => changeQuantity(index, item.qty - 1)}
                      >
                        -
                      </Button>
                      <Button
                        className="px-2 ml-1 py-1"
                        size="sm"
                        variant="info"
                        onClick={() => changeQuantity(index, item.qty + 1)}
                      >
                        +
                      </Button>
                    </td>
                    <td>
                      {item.price}*{item.qty}
                    </td>
                    <td>{item.price * item.qty}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="5">Total</td>
                  <td>{total}</td>
                </tr>
              </tbody>
            </Table>
            <Button
              className="btn px-2 ml-1 py-1"
              size="sm"
              variant="info"
              onClick={clickorderProducts}
            >
              Select Product
            </Button>

            <input
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
              value="Add Dish"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default NewOrder;
