import styles from '../../styles/app.module.scss'
import React from "react";

const Input = ({ defaultValue, onChange, value }) => {
  return <input className={styles.input} type="text" defaultValue={defaultValue} value={value} onChange={onChange} />
}

export default Input;
