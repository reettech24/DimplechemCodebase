import React from 'react'
import ContentTop from '../../components/ContentTop/ContentTop';
import "./LeadGenerate.css";
import LeadGeneration from '../../components/CustomerRequirement/LeadGeneration';

const LeadGenerate = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <LeadGeneration/>
    </div>
  )
}

export default LeadGenerate