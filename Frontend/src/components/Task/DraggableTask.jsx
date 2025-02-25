/* eslint-disable react/prop-types */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CiEdit } from 'react-icons/ci';
import { FaRegTrashAlt } from 'react-icons/fa';

const DraggableTask = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
    >
      <h3 className="text-sm font-medium text-gray-700">{task.title}</h3>
      <p className="text-xs text-gray-500">{task.description}</p>
      <div className="text-xs text-gray-400">{task.timestamp}</div>
      <div className="mt-2 flex space-x-2">
        <button
          className="text-blue-500 text-xs border px-3 py-1 rounded"
          onClick={() => onEdit(task)}
        >
          <CiEdit size={14} />
        </button>
        <button
          className="text-red-500 text-xs border px-3 py-1 rounded"
          onClick={() => onDelete(task)}
        >
          <FaRegTrashAlt size={14} />
        </button>
      </div>
    </div>
  );
};

export default DraggableTask;
