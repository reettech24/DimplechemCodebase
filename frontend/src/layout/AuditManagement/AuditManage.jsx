import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop';
import "./AuditManage.css";
import AuditManageData from '../../components/AuditManagement/AuditManageData';

const AuditManage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <AuditManageData/>
    </div>
  )
}

export default AuditManage
