import TaskCard from "./TaskCard";

type Task = Parameters<typeof TaskCard>[0]["task"];
type OnStatusChange = Parameters<typeof TaskCard>[0]["onStatusChange"];

type KanbanColumnProps = {
  title: string;
  tasks: Task[];
  onStatusChange: OnStatusChange;
};

export default function KanbanColumn({
  title,
  tasks,
  onStatusChange,
}: KanbanColumnProps) {
  return (
    <div className="bg-slate-100 rounded-xl p-5 min-h-150">
      <div className="flex justify-between mb-5">
        <h2 className="font-bold text-slate-700">{title}</h2>
        <span className="bg-white px-2 rounded text-sm">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm">No tasks</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
