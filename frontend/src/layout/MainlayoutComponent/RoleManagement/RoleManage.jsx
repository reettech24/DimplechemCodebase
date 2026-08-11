import "../../MainCssFile.css";
import ContentTop from '../../../components/ContentTop/ContentTop';
import RoleManageData from "../../../components/MainComponent/RoleManagement/RoleManageData";

const RoleManage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <RoleManageData/>
    </div>
  )
}

export default RoleManage;