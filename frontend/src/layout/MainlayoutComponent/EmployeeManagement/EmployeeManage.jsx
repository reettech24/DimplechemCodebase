import "../../MainCssFile.css";
import ContentTop from '../../../components/ContentTop/ContentTop';
import EmployeeManageData from "../../../components/MainComponent/HRManagement/EmployeeManagement/EmployeeManageData";

const EmployeeManage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <EmployeeManageData/>
    </div>
  )
}

export default EmployeeManage;