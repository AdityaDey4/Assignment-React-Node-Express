import { useEffect, useState } from "react";
import axios from "axios";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

const TodosPage = ()=> {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

 const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (text) => {
    
    try {
      const res = await axios.post("http://localhost:5000/tasks", { title : text, status : "pending" }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // just click on the todo text to update (COMPLETED)
  const toggleTodo = async (id) => {

    try {
      const res = await axios.put(
        `http://localhost:5000/tasks/${id}`,
        {status : "completed"},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(res.data);
      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "completed") return t.status == "completed";
    if (filter === "pending") return t.status == "pending";
    return true;
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-amber-50">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-xl p-6 border-2">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Todo List
        </h1>
        
        <TodoForm onAdd={addTodo} />

        <div className="flex justify-center gap-3 my-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "completed"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg border ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
        </div>

        <TodoList todos={filteredTodos} onToggle={toggleTodo} />
      </div>
    </div>
  );
}

export default TodosPage;