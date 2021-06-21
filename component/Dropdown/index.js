import styles from '../../styles/app.module.scss'
import React from "react";

const Dropdown = ({ defaultValue, onChange, items = [] }) => {
  return  <select className={styles.dropdown} defaultValue={defaultValue} onChange={onChange}>
            {items.map(item =>
                <option key={item.value} value={item.value}>{item.label}</option>
            )}
          </select>
}

export default Dropdown;
