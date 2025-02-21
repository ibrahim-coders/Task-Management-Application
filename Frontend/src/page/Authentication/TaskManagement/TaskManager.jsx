import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../../../AuthContext/AuthPrvider';
import { CiEdit } from 'react-icons/ci';
import { FaRegTrashAlt } from 'react-icons/fa';
import TaskManagement from './TaskManagemen';
const socket = io(`${import.meta.env.VITE_API_URL}`);

const TaskManager = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [openModals, setOpenModals] = useState({});
  const [editTask, setEditTask] = useState({ title: '', description: '' });
  // const [errorMess, setErrorMess] = useState('');
  // const [errorMessDescription, setErrorMessDescription] = useState('');

  // Fetch tasks when component loads
  useEffect(() => {
    loadTasks();

    // Listen for real-time task updates
    socket.on('taskAdded', loadTasks);
    socket.on('taskDeleted', loadTasks);
    socket.on('taskUpdated', loadTasks);

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off('taskAdded', loadTasks);
      socket.off('taskDeleted', loadTasks);
      socket.off('taskUpdated', loadTasks);
    };
  }, [tasks]);

  // Load tasks from the backend
  const loadTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/displaytasks/${user?.email}`
      );
      setTasks(response.data);
    } catch (error) {
      console.log('Error loading tasks', error);
    }
  };
  // if (editTask.title.length > 50) {
  //   return setErrorMess('Max 50 characters allowed');
  // }
  // if (editTask.description.length > 200) {
  //   return setErrorMessDescription('Max 200 characters allawed');
  // }
  // Change task status
  const handleCategoriesChanges = async currentStatus => {
    try {
      let newStatus;
      if (currentStatus === 'To-Do') {
        newStatus = 'In Progress';
      } else if (currentStatus === 'In Progress') {
        newStatus = 'Done';
      } else if (currentStatus === 'Done') {
        newStatus = 'To-Do';
      }

      // Update status in the backend
      await axios.put(
        `${import.meta.env.VITE_API_URL}/statusChange/${currentStatus}`,
        { newStatus }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Add a new task

  // // Delete a task
  const deleteTask = async taskId => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/taksDelete/${taskId}`
      );
    } catch (error) {
      console.log('Error deleting task', error);
    }
  };
  //update task

  const toggleModal = taskId => {
    setOpenModals(prev => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };
  const handleTaksUpdate = async taskId => {
    console.log(taskId);

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/taskUpdated/${taskId}`,
        {
          title: editTask.title,
          description: editTask.description,
        }
      );

      toggleModal(taskId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TaskManagement />
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 relative ">
        {tasks.map(task => (
          <div
            key={task._id}
            className=" p-4 w-full h-44 box-shadow rounded-md flex flex-col relative space-y-2"
          >
            {/* Task Title */}
            <h6 className=" text-sm font-medium">{task.title}</h6>

            {/* Task Description */}
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>

            {/* Buttons Section (Bottom-Left Aligned) */}
            <div>
              <span className="text-[12px] absolute bottom-3 left-3">
                {new Date(task.timestamp).toLocaleString()}
              </span>

              <div className="absolute bottom-3  right-3 gap-2 flex justify-center items-end">
                <button
                  onClick={() => handleCategoriesChanges(task.status)}
                  className={`${
                    task.status === 'To-Do'
                      ? ' transition cursor-pointer  text-sm'
                      : task.status === 'In Progress'
                      ? 'text-orange-600 transition cursor-pointer  text-sm'
                      : task.status === 'Done'
                      ? 'text-green-500  transition cursor-pointer  text-sm'
                      : ''
                  }`}
                >
                  {task.status}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => toggleModal(task._id)}
                  className="text-blue-500 hover:text-blue-600 transition cursor-pointer px-2"
                >
                  <CiEdit size={18} />
                </button>

                {/* Delete Button */}
                <button
                  className="text-red-500 hover:text-red-600 cursor-pointer transition"
                  onClick={() => deleteTask(task._id)}
                >
                  <FaRegTrashAlt size={18} />
                </button>
              </div>
            </div>

            {/* Modal - Opens only for the clicked task */}
            {openModals[task._id] && (
              <div className="absolute top-0 left-0 w-full bg-white shadow-lg p-4 rounded-md z-10">
                <h3 className="text-lg font-medium mb-2">Edit Task</h3>
                <label className="block mb-1 text-sm ">Task title</label>
                <input
                  type="text"
                  defaultValue={task.title}
                  onChange={e =>
                    setEditTask(prev => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* <p className="text-red-500 text-sm py-1.5">{errorMess}</p> */}
                <label className="block mb-1 mt-4 text-sm ">Description</label>
                <textarea
                  defaultValue={task.description}
                  onChange={e =>
                    setEditTask(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
                {/* <p className="text-red-500 text-sm py-1.5">
                {errorMessDescription}
              </p> */}
                <div className="flex">
                  <button
                    onClick={() => handleTaksUpdate(task._id)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => toggleModal(task._id)}
                    className="absolute top-1 right-1 text-red-500 cursor-pointer transition"
                  >
                    ✖
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskManager;
