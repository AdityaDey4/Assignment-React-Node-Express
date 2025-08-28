
const TodoList = ({todos, onToggle})=> {

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`flex justify-between items-center p-2 border rounded ${
            todo.status == "completed" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <span
            className={`cursor-pointer ${
              todo.completed ? "line-through text-gray-500" : ""
            }`}
            onClick={() => onToggle(todo.id)}
          >
            {todo.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;