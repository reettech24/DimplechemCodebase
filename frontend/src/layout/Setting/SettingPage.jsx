import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop';
import "./SettingPage.css";
import SettingData from '../../components/SettingsPage/SettingData';

const SettingPage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <SettingData/>
    </div>
  )
}

export default SettingPage