import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop';
import "./QuotationManage.css";
import QuotationManageData from '../../components/QuotationManagement/QuotationManageData';

const QuotationManage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <QuotationManageData/>
    </div>
  )
}

export default QuotationManage
