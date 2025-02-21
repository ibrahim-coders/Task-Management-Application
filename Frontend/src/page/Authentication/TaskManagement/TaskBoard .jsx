import { useContext, useState } from 'react';
import { AuthContext } from '../../../AuthContext/AuthPrvider';
import axios from 'axios';
import { IoMdAdd } from 'react-icons/io';
import TaskManager from './TaskManager';
const TaskBoard = () => {
  const [isModel, setModale] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  //model
  const handleTaksModal = isModel => setModale(!isModel);
  const addTask = async () => {
    if (!user.email) return;
    try {
      // Validate Task Input
      if (!taskInput.trim()) {
        return setErrorMessage('Title is required.');
      }
      if (taskInput.length > 50) {
        return setErrorMessage('Max 50 characters allowed.');
      }
      if (!description.trim()) {
        return setErrorDescription('Description is required.');
      }
      if (description.length > 200) {
        return setErrorDescription('Max 200 characters allowed.');
      }

      // Clear previous errors
      setErrorMessage('');
      setErrorDescription('');

      // Create new task object
      const newTask = {
        title: taskInput.trim(),
        description: description.trim(),
        email: user?.email,
        status: 'To-Do',
        timestamp: new Date().toISOString(),
      };
      // setTasks([...tasks, newTask]);
      setTaskInput('');
      setDescription('');

      // Send task to server
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        newTask
      );
      setModale(false);
      console.log('Task Added:', response.data);
    } catch (error) {
      console.error('Error adding task:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="border-l-2 border-sky-400 ">
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-500">
        Task Manager
      </h1>
      <div className="flex  gap-4 ">
        {/* add Taks */}
        <div className="w-96 h-72 rounded-md box-shadow m-2">
          <div className="flex justify-center items-center h-full ">
            <button
              onClick={() => handleTaksModal(isModel)}
              className="flex gap-2 items-center cursor-pointer"
            >
              {' '}
              <IoMdAdd className="tex-2xl" />
              <span>Add to Taks</span>
            </button>
          </div>
        </div>
        {/* add model */}
        <div className="container mx-auto ">
          {isModel && (
            <div className=" w-96">
              <label className="block mb-2 text-sm font-medium ">
                Task title
              </label>
              <input
                type="text"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
              />
              <p className="text-red-500 py-1.5 text-sm">{errorMessage}</p>
              {/* description */}
              <div>
                <label className="block mb-2 text-sm font-medium ">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter your description here..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
                <p className="text-red-500 py-1.5 text-sm">
                  {errorDescription}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleTaksModal}
                  className="py-2 px-3 bg-gray-300 text-black rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="ml-2 py-2 px-3 bg-blue-500 text-white rounded"
                >
                  Add Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* taks list */}
      <h2 className="text-xl font-medium p-4 text-blue-500">Task </h2>

      <div className=" ">
        {/* Task List Section */}

        <TaskManager />
      </div>
    </section>
  );
};

export default TaskBoard;
