import Screen from '../components/Screen/Screen';
import TaksUser from '../page/Authentication/TaskManagement/TaksUser';

const Work = () => {
  return (
    <div>
      <div className="grid grid-cols-6">
        <div>
          <TaksUser />
        </div>
        <div className="col-span-5 mt-2 mr-3 h-screen">
          <Screen />
        </div>
      </div>
    </div>
  );
};

export default Work;
