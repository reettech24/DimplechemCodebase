import "../../MainCssFile.css";
import ContentTop from '../../../components/ContentTop/ContentTop';
import DepartmentManageData from "../../../components/MainComponent/DepartmentManagement/DepartmentManageData";

const DepartmentManage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <DepartmentManageData/>
    </div>
  )
}

export default DepartmentManage;