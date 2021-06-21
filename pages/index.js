import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { getLocation, getProduct, addToCart } from '../lib/api'
import DatePickerBox from '../component/DatePickerBox'
import ModalBox from '../component/ModalBox'
import Button from '../component/Button'
import Dropdown from '../component/Dropdown'
import Input from '../component/Input'
import moment from 'moment';

export default function Home({ products, locations }) {

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
      // window.location.reload();
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.mainbox}>
          <h1>Calculator</h1>
          <form>
            <div className={styles.flexbox}>
              <div>Product</div>
              <div>
                <Dropdown defaultValue={products[0]} onChange={e => setSelectedProduct(products.filter(product => parseInt(product.id) === parseInt(e.target.value))[0])} items={dropdownItems} />
              </div>
            </div>
            <div className={styles.flexbox}>
              <div>
                Date
              </div>
              <div>
                <DatePickerBox selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
              </div>
            </div>
            <div className={styles.flextitle}>
              <div className={styles.flexitem}>
                <div>Locations</div>
              </div>
              <div>
                <div className={styles.flexitem}>
                  <div>
                    <div>
                      Place
                    </div>
                  </div>
                  <div>
                    <div>
                      Units
                    </div>
                  </div>
                  <div>
                    <div>
                      Cost
                    </div>
                  </div>
                  <div>
                    <Button onClick={openModal} label={`Add`} />
                  </div>
                </div>
                {items.map(item => {
                  return <div key={item.id} className={styles.flexitem}>
                    <div>
                      <div>
                        {item.name}
                      </div>
                    </div>
                    <div>
                      <div>
                        <Input type={`text`} defaultValue={item.unit} onChange={e => updateItem(item.id, e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <div>
                        {item.cost}
                      </div>
                    </div>
                    <div>
                      <Button onClick={() => removeItem(item.id)} label={`x`} />
                    </div>
                  </div>
                })}
              </div>
            </div>
            <div className={styles.flexbox}>
              <div>Total Units</div>
              <div>{totalUnit}</div>
            </div>
            <div className={styles.flexbox}>
              <div>Total Cost</div>
              <div>{totalCost}</div>
            </div>
            <div className={styles.flextitle}>
              <div className={styles.flexitem}>
                <Button onClick={() => submitForm()} label={`Submit`} />
              </div>
              <div className={styles.errorMsg}>
                <ErrorMessage />
              </div>
            </div>
          </form>
        </div>
      </main>
      <ModalBox modalIsOpen={modalIsOpen} closeModal={closeModal} locations={locations} setItems={setItems} items={items} selectedProduct={selectedProduct} />
    </div>
  )
}

export async function getServerSideProps() {
  const products = await getProduct();
  const locations = await getLocation();
  return {
    props: {
      products,
      locations
    }
  }
};
