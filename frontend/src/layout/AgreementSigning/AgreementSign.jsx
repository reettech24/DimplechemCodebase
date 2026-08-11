import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop';
import "./AgreementSign.css";
import AgreementSignData from '../../components/QuotationManagement/AgreementSigning/AgreementSignData';

const AgreementSign = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <AgreementSignData/>
    </div>
  )
}

export default AgreementSign
