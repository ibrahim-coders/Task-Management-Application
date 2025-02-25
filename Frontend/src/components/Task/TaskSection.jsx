/* eslint-disable react/prop-types */

// export default TaskSection;

import { useDroppable } from '@dnd-kit/core';
import { rectSwappingStrategy, SortableContext } from '@dnd-kit/sortable';
import DraggableTask from './DraggableTask';

const DroppableArea = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="min-h-[100px]">
      {children}
    </div>
  );
};

/* eslint-disable react/prop-types */
const TaskSection = ({ id, title, color, tasks, onEdit, onDelete }) => {
  return (
    <div className="flex-1 bg-white rounded-lg shadow-md p-4 mx-2">
      <div className="flex items-center mb-4">
        <div className={`w-4 h-4 ${color} rounded-full mr-2`}></div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <span className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-xs">
          {tasks.length}
        </span>
      </div>
      <DroppableArea id={id}>
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={rectSwappingStrategy}
        >
          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <DraggableTask
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <div className="text-gray-400 p-4">Drop here</div>
            )}
          </div>
        </SortableContext>
      </DroppableArea>
    </div>
  );
};

export default TaskSection;
