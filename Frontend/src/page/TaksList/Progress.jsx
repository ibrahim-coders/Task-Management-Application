import AddTaks from '../Authentication/TaskManagement/AddTaks';
import TaskManager from '../Authentication/TaskManagement/TaskManager';

const Progress = () => {
  return (
    <div className="px-4">
      <AddTaks />
      <TaskManager />
    </div>
  );
};

export default Progress;
