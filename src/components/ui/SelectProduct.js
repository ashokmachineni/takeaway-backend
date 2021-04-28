import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";

const SelectProduct = ({
  show,
  handleClose,
  foodItems,
  setOrderProduct,
  orderProduct,
}) => {
  const addProduct = async (item) => {
    if (!orderProduct.find((p) => p.name === item.name)) {
      const data = {
        name: item.name,
        price: item.price,
        image: item.image,
        qty: 1,
      };
      setOrderProduct([...orderProduct, data]);
    }
  };

  return (
    <Modal centered show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Food Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th width="50"></th>
              <th>Name</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {foodItems?.map((item, index) => (
              <tr>
                <td width={80} className="p-1">
                  <img className="img-fluid" src={item.image} />
                </td>
                <td>{item.name}</td>

                <td>{item.price}</td>
                <td>
                  <Button
                    className="px-2 ml-1 py-1"
                    size="sm"
                    variant="danger"
                    onClick={() => addProduct(item)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectProduct;
