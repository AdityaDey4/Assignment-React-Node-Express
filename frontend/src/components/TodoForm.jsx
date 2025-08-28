import { useState } from "react";

const TodoForm = ({ onAdd })=> {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    onAdd(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter new task"
        className="border flex-1 p-2 rounded"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
}

export default TodoForm;