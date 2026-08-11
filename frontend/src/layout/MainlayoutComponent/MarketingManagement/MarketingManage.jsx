import "../../MainCssFile.css";
import ContentTop from '../../../components/ContentTop/ContentTop';
import MarketingManageData from "../../../components/MainComponent/MarketingManagement/MarketingManageData";

const MarketingManage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <MarketingManageData/>
    </div>
  )
}

export default MarketingManage;