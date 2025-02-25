import { useState, useEffect, useRef, useContext } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskSection from '../Task/TaskSection';
import { io } from 'socket.io-client';
import { AuthContext } from '../../AuthContext/AuthPrvider';

const Screen = () => {
  const { user } = useContext(AuthContext);

  // Task states – populated via Socket.io updates.
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  // Modal state for adding a new task.
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('todo');

  // Modal state for editing a task.
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskCategory, setEditTaskCategory] = useState('todo');
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  const socketRef = useRef();

  // Sensors for mobile (pointer, touch) and keyboard drag‑and‑drop.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  // Initialize socket connection once the user is authenticated.
  useEffect(() => {
    if (user) {
      socketRef.current = io('https://taskflow-server-ra21.onrender.com/', {
        auth: { email: user.email },
      });
      socketRef.current.on('tasksUpdated', data => {
        setTodoTasks(data.todo || []);
        setInProgressTasks(data.inProgress || []);
        setDoneTasks(data.done || []);
      });
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  // Helper to determine which container a task belongs to.
  const findContainer = id => {
    if (todoTasks.find(task => task.id === id)) return 'todo';
    if (inProgressTasks.find(task => task.id === id)) return 'inProgress';
    if (doneTasks.find(task => task.id === id)) return 'done';
    return null;
  };

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over) return;
    const sourceContainer = findContainer(active.id);
    let destinationContainer = findContainer(over.id);
    if (
      !destinationContainer &&
      ['todo', 'inProgress', 'done'].includes(over.id)
    ) {
      destinationContainer = over.id;
    }
    if (!sourceContainer || !destinationContainer) return;

    let newTodoTasks = [...todoTasks];
    let newInProgressTasks = [...inProgressTasks];
    let newDoneTasks = [...doneTasks];
    let movedTask;

    if (sourceContainer === destinationContainer) {
      if (sourceContainer === 'todo') {
        const oldIndex = newTodoTasks.findIndex(task => task.id === active.id);
        const newIndex = newTodoTasks.findIndex(task => task.id === over.id);
        newTodoTasks = arrayMove(newTodoTasks, oldIndex, newIndex);
      } else if (sourceContainer === 'inProgress') {
        const oldIndex = newInProgressTasks.findIndex(
          task => task.id === active.id
        );
        const newIndex = newInProgressTasks.findIndex(
          task => task.id === over.id
        );
        newInProgressTasks = arrayMove(newInProgressTasks, oldIndex, newIndex);
      } else if (sourceContainer === 'done') {
        const oldIndex = newDoneTasks.findIndex(task => task.id === active.id);
        const newIndex = newDoneTasks.findIndex(task => task.id === over.id);
        newDoneTasks = arrayMove(newDoneTasks, oldIndex, newIndex);
      }
    } else {
      // Moving task between containers.
      if (sourceContainer === 'todo') {
        movedTask = newTodoTasks.find(task => task.id === active.id);
        newTodoTasks = newTodoTasks.filter(task => task.id !== active.id);
      } else if (sourceContainer === 'inProgress') {
        movedTask = newInProgressTasks.find(task => task.id === active.id);
        newInProgressTasks = newInProgressTasks.filter(
          task => task.id !== active.id
        );
      } else if (sourceContainer === 'done') {
        movedTask = newDoneTasks.find(task => task.id === active.id);
        newDoneTasks = newDoneTasks.filter(task => task.id !== active.id);
      }
      if (destinationContainer === 'todo') {
        newTodoTasks.push(movedTask);
      } else if (destinationContainer === 'inProgress') {
        newInProgressTasks.push(movedTask);
      } else if (destinationContainer === 'done') {
        newDoneTasks.push(movedTask);
      }
    }

    // Update local state.
    setTodoTasks(newTodoTasks);
    setInProgressTasks(newInProgressTasks);
    setDoneTasks(newDoneTasks);

    // Emit updated task order with userEmail.
    const tasksData = {
      todo: newTodoTasks.map(task => ({
        ...task,
        status: 'todo',
        userEmail: user.email,
      })),
      inProgress: newInProgressTasks.map(task => ({
        ...task,
        status: 'inProgress',
        userEmail: user.email,
      })),
      done: newDoneTasks.map(task => ({
        ...task,
        status: 'done',
        userEmail: user.email,
      })),
    };
    socketRef.current.emit('updateTaskOrder', tasksData);
  };

  // Add Task Modal handler.
  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDescription,
      timestamp: new Date().toLocaleTimeString(),
      status: newTaskCategory,
      userEmail: user.email,
    };
    socketRef.current.emit('newTask', newTask);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskCategory('todo');
    setShowAddModal(false);
  };

  // Delete Task Handler.
  const handleDeleteTask = task => {
    let newTodoTasks = todoTasks;
    let newInProgressTasks = inProgressTasks;
    let newDoneTasks = doneTasks;
    if (task.status === 'todo') {
      newTodoTasks = todoTasks.filter(t => t.id !== task.id);
      setTodoTasks(newTodoTasks);
    } else if (task.status === 'inProgress') {
      newInProgressTasks = inProgressTasks.filter(t => t.id !== task.id);
      setInProgressTasks(newInProgressTasks);
    } else if (task.status === 'done') {
      newDoneTasks = doneTasks.filter(t => t.id !== task.id);
      setDoneTasks(newDoneTasks);
    }
    const tasksData = {
      todo: newTodoTasks.map(t => ({
        ...t,
        status: 'todo',
        userEmail: user.email,
      })),
      inProgress: newInProgressTasks.map(t => ({
        ...t,
        status: 'inProgress',
        userEmail: user.email,
      })),
      done: newDoneTasks.map(t => ({
        ...t,
        status: 'done',
        userEmail: user.email,
      })),
    };
    socketRef.current.emit('updateTaskOrder', tasksData);
  };

  // Initiate Edit Task.
  const handleEditInitiate = task => {
    setTaskBeingEdited(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setEditTaskCategory(task.status);
    setShowEditModal(true);
  };

  // Save Edited Task.
  const handleUpdateTask = () => {
    if (!taskBeingEdited) return;
    const updatedTask = {
      ...taskBeingEdited,
      title: editTaskTitle,
      description: editTaskDescription,
      status: editTaskCategory,
      timestamp: new Date().toLocaleTimeString(),
      userEmail: user.email,
    };
    let newTodoTasks = todoTasks.filter(t => t.id !== taskBeingEdited.id);
    let newInProgressTasks = inProgressTasks.filter(
      t => t.id !== taskBeingEdited.id
    );
    let newDoneTasks = doneTasks.filter(t => t.id !== taskBeingEdited.id);
    if (editTaskCategory === 'todo') {
      newTodoTasks.push(updatedTask);
    } else if (editTaskCategory === 'inProgress') {
      newInProgressTasks.push(updatedTask);
    } else if (editTaskCategory === 'done') {
      newDoneTasks.push(updatedTask);
    }
    setTodoTasks(newTodoTasks);
    setInProgressTasks(newInProgressTasks);
    setDoneTasks(newDoneTasks);
    const tasksData = {
      todo: newTodoTasks.map(t => ({
        ...t,
        status: 'todo',
        userEmail: user.email,
      })),
      inProgress: newInProgressTasks.map(t => ({
        ...t,
        status: 'inProgress',
        userEmail: user.email,
      })),
      done: newDoneTasks.map(t => ({
        ...t,
        status: 'done',
        userEmail: user.email,
      })),
    };
    socketRef.current.emit('updateTaskOrder', tasksData);
    setTaskBeingEdited(null);
    setShowEditModal(false);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="mockup-window bg-base-200 border ml-3">
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
          <div className="flex justify-between w-11/12 mx-auto">
            <div>
              <h1 className="text-lg lg:text-2xl font-bold dark:text-white text-gray-800 mb-6">
                Task Management
              </h1>
            </div>
            <div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 mb-3 lg:mb-0"
              >
                Add Task
              </button>
            </div>
          </div>
          <div
            style={{ touchAction: 'none' }}
            className="flex flex-col md:flex-row gap-4"
          >
            <TaskSection
              id="todo"
              title="To-Do"
              color="bg-blue-500"
              tasks={todoTasks}
              onEdit={handleEditInitiate}
              onDelete={handleDeleteTask}
            />
            <TaskSection
              id="inProgress"
              title="In Progress"
              color="bg-yellow-500"
              tasks={inProgressTasks}
              onEdit={handleEditInitiate}
              onDelete={handleDeleteTask}
            />
            <TaskSection
              id="done"
              title="Done"
              color="bg-green-500"
              tasks={doneTasks}
              onEdit={handleEditInitiate}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <div className="mb-4">
              <label className="block text-gray-700">
                Title (required, max 50 characters)
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                maxLength={50} // Limit title length
              />
              <p className="text-sm text-gray-500">
                {50 - newTaskTitle.length} characters left
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">
                Description (optional, max 200 characters)
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                value={newTaskDescription}
                onChange={e => setNewTaskDescription(e.target.value)}
                maxLength={200} // Limit description length
              ></textarea>
              <p className="text-sm text-gray-500">
                {200 - newTaskDescription.length} characters left
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={newTaskCategory}
                onChange={e => setNewTaskCategory(e.target.value)}
              >
                <option value="todo">To-Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={editTaskTitle}
                onChange={e => setEditTaskTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                value={editTaskDescription}
                onChange={e => setEditTaskDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={editTaskCategory}
                onChange={e => setEditTaskCategory(e.target.value)}
              >
                <option value="todo">To-Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateTask}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
};

export default Screen;
