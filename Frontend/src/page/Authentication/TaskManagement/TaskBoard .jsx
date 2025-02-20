import { useState } from 'react';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [description, setDescription] = useState('');
  const addTask = () => {
    const newTask = {
      title: taskInput,
      description: description,
      category: 'To-Do',
      timestamp: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setTaskInput('');
    console.log(newTask);
  };

  const taskss = {
    todo: [
      'Complete React project setup',
      'Write tests for the app',
      'Fix bugs in the code',
    ],
    inProgress: ['Design the homepage layout', 'Add CSS for the header'],
    done: ['Implement authentication', 'Setup MongoDB database'],
  };
  return (
    <div className="grid  gap-4 border-l-2 border-sky-400 h-full">
      <div className="container mx-auto p-5">
        <div className="p-4">
          <div className="mb-4 max-w-screen-sm">
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
            </div>
            <button
              onClick={addTask}
              className="ml-2 py-2 px-3 bg-blue-500 text-white rounded"
            >
              Add Task
            </button>
          </div>

          <div className="flex space-x-4">
            {['To-Do', 'In Progress', 'Done'].map(category => (
              <div key={category} className="w-1/3">
                <h2 className="text-lg font-bold">{category}</h2>
                <div className="bg-gray-100 p-4 rounded">
                  {tasks
                    .filter(task => task.category === category)
                    .map((task, index) => (
                      <div
                        key={index}
                        className="p-2 mb-2 bg-white border border-gray-300 rounded  overflow-y-auto"
                      >
                        <h3 className="font-semibold">{task.title}</h3>
                        <p>{task.description}</p>
                        <small>{task.timestamp}</small>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* To-Do Category */}
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">To-Do</h2>
            <ul>
              {taskss.todo.map((task, index) => (
                <li key={index} className="p-2 border-b">
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* In Progress Category */}
          <div className="bg-blue-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              In Progress
            </h2>
            <ul>
              {taskss.inProgress.map((task, index) => (
                <li key={index} className="p-2 border-b">
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* Done Category */}
          <div className="bg-green-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">Done</h2>
            <ul>
              {taskss.done.map((task, index) => (
                <li key={index} className="p-2 border-b">
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
