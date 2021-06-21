import React, {useEffect, useState} from "react";
import moment from "moment";
import {addToCart} from "../lib/api";

export default function useHome({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalIsOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [totalUnit, setTotalUnit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [errorMsg, setErrorMsg] = useState([]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    calculate(items);
  }

  function removeItem(id) {
    const newItems = items.filter(x => x.id !== id);
    setItems(newItems);
  };

  function updateItem(id, qty) {
    const newItems = items.map(item => {
      if (item.id === id) {
        const { price_per_unit } = selectedProduct;
        return {
          ...item,
          unit: parseInt(qty),
          cost: (price_per_unit*parseInt(qty)) + item.fee
        }
      }
      return item;
    })
    setItems(newItems);
  };

  function validate() {
    const errArr = [];
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 7);
    const isBetween = moment(selectedDate).isBetween(startDate, endDate);

    const isOverStock = items.some(item => {
      return item.maxDist < item.unit
    })

    if (items.length < 1) {
      errArr.push('No selected locations.')
    }
    if (!isBetween) {
      errArr.push('Date is out of range.')
    }
    if (isOverStock) {
      errArr.push('Out of max distribution')
    }
    if (errArr.length === 0) {
      return true;
    }
    setErrorMsg(errArr);
  }

  async function submitForm() {
    const isValidate = validate();
    if (isValidate) {
      const cartLocation = items.map(item => {
        return {
          id: item.id,
          quantity: item.unit
        }
      })
      const res = await addToCart({
        locations: cartLocation,
        product: selectedProduct.id,
        date: moment(selectedDate).format('YYYY-MM-DD')
      });
      alert('success');
      window.location.reload();
    }
  }

  function calculate() {
    let unit = 0;
    let cost = 0;

    items.map(item => {
      unit+=item.unit,
          cost+=item.cost
    });
    setTotalUnit(unit);
    setTotalCost(cost);
  }

  useEffect(() => {
    items.map(item => {
      updateItem(item.id, item.unit)
    })
  }, [selectedProduct]);

  useEffect(() => {
    calculate(items);
  }, [items, selectedProduct, setTotalUnit, setTotalCost]);

  const dropdownItems = products.map(product => {
    return {
      value: product.id,
      label: product.name
    }
  });

  function ErrorMessage() {
    return errorMsg.map((msg,index) => {
      return <div key={index}>{msg}</div>
    })
  }

  return {
    items,
    setItems,
    updateItem,
    selectedProduct,
    setSelectedProduct,
    selectedDate,
    setSelectedDate,
    totalUnit,
    totalCost,
    dropdownItems,
    modalIsOpen,
    openModal,
    closeModal,
    removeItem,
    ErrorMessage,
    submitForm
  }
};
