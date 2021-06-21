import styles from '../../styles/app.module.scss'
import React from "react";

const Button = ({ text, disabled, onClick }) => {
  return <button disabled={disabled} className={styles.button} type="button" onClick={onClick}>
    {text}
  </button>;
}

export default Button;
