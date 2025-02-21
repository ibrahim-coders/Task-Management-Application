const TaskManagement = () => {
  return (
    <div className="flex w-full  gap-2 p-4 bg-gray-100 ">
      <button className=" w-full bg-blue-500 text-white px-2  rounded-md py-3">
        To-Do
      </button>
      <button className=" w-full bg-yellow-500 text-white px-2  rounded-md py-3">
        InProgress
      </button>
      <button className=" w-full bg-green-500 text-white px-2  rounded-md py-3">
        Done
      </button>
    </div>
  );
};

export default TaskManagement;
