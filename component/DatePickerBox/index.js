import styles from '../../styles/app.module.scss'
import React from "react";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DatePickerBox = ({ onChange, selected }) => {
  return <DatePicker className={styles.datepicker} selected={selected} onChange={onChange} />
}

export default DatePickerBox;
