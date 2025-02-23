import AddTaks from './AddTaks';
import TaskManager from './TaskManager';
const TaskBoard = () => {
  return (
    <section className=" ">
      <AddTaks />

      <div className=" px-4 grid grid-cols-1">
        {/* Task List Section */}
        <TaskManager />
      </div>
    </section>
  );
};

export default TaskBoard;
