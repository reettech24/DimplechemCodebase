import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop';
import "./DocumentManage.css";
import DocumentManageData from '../../components/DocumentManagement/DocumentManageData';

const DocumentManage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <DocumentManageData />
    </div>
  )
}

export default DocumentManage
