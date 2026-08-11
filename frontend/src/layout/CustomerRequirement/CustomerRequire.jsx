import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop';
import "./CustomerRequire.css";
import UserManageDataCR from '../../components/CustomerRequirement/UserManageDataCR';

const CustomerRequire = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <UserManageDataCR/>
    </div>
  )
}

export default CustomerRequire
