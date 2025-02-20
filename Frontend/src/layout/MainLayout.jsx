import TaksUser from '../page/Authentication/TaskManagement/TaksUser';
import TaskBoard from '../page/Authentication/TaskManagement/TaskBoard ';
const MainLayout = () => {
  return (
    <div className="max-w-screen-xl mx-auto my-10 px-4 grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="col-span-2">
        {' '}
        <TaksUser />
      </div>
      <div className="col-span-10">
        {' '}
        <TaskBoard />
      </div>
    </div>
  );
};
export default MainLayout;
