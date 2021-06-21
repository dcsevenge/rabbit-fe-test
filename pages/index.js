import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { getLocation, getProduct, addToCart } from '../lib/api'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ModalBox from '../component/ModalBox'
import Button from '../component/Button'
import Dropdown from '../component/Dropdown'
import moment from 'moment';

export default function Home({ products, locations }) {

  const [selectedProduct, setSelectedProduct] = useState(parseInt(products[0].id));
  const [startDate, setStartDate] = useState(new Date());
  const [modalIsOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [totalUnit, setTotalUnit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

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
        return {
          ...item,
          unit: parseInt(qty)
        }
      }
      return item;
    })
    setItems(newItems);
  };

  async function submitForm() {
    const cartLocation = items.map(item => {
      return {
        id: item.id,
        quantity: item.unit
      }
    })
    const res = await addToCart({ locations: cartLocation, product: selectedProduct, date: moment(startDate).format('YYYY-MM-DD') });
    alert('success');
    window.location.reload();
  }

  function calculate() {
    let unit = 0;
    let cost = 0;

    items.map(item => {
      unit+=item.unit,
      cost = cost + (item.cost*item.unit)
    });
    setTotalUnit(unit);
    setTotalCost(cost);
  }

  useEffect(() => {
    calculate(items);
  }, [items, setTotalUnit, setTotalCost]);

  const dropdownItems = products.map(product => {
    return {
      value: product.id,
      label: product.name
    }
  })

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
                {/*<select className={styles.dropdown} >*/}
                {/*  {products.map(product =>*/}
                {/*      <option key={product.id} value={product.id}>{product.name}</option>*/}
                {/*  )}*/}
                {/*</select>*/}
                <Dropdown defaultValue={parseInt(products[0].id)} onChange={e => setSelectedProduct(parseInt(e.target.value))} items={dropdownItems} />
              </div>
            </div>
            <div className={styles.flexbox}>
              <div>
                Date
              </div>
              <div>
                <DatePicker className={styles.datepicker} selected={startDate} onChange={(date) => setStartDate(date)} />
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
                        <input className={styles.input} type="text" defaultValue={item.unit}onChange={e => updateItem(item.id, e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <div>
                        {item.cost}
                      </div>
                    </div>
                    <div>
                      <button className={styles.button} type="button" onClick={() => removeItem(item.id)}>x</button>
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
            <div className={styles.flexbox}>
              <div>
                <Button onClick={() => submitForm()} label={`Submit`} />
              </div>
            </div>
          </form>
        </div>
      </main>
      <ModalBox modalIsOpen={modalIsOpen} closeModal={closeModal} locations={locations} setItems={setItems} items={items} />
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
