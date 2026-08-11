import "./UserManage.css";
import ContentTop from '../../components/ContentTop/ContentTop';
import UserManageData from "../../components/UserManagement/UserManageData";

const UserManage = () => {
  return (
    <div className='main-content'>
      <ContentTop />
      <UserManageData />
    </div>
  )
}

export default UserManage;