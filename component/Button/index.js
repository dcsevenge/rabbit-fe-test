import styles from '../../styles/app.module.scss'
import React from "react";

const Button = ({ label, disabled, onClick }) => {
  return <button disabled={disabled} className={styles.button} type="button" onClick={onClick}>
    {label}
  </button>;
}

export default Button;
