import styles from '../../styles/app.module.scss'
import React from "react";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DatePickerBox = ({ defaultValue, onChange, value }) => {
  return <DatePicker className={styles.datepicker} selected={startDate} onChange={(date) => setStartDate(date)} />
}

export default DatePickerBox;
