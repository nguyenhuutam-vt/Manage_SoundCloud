import { useState } from "react";

interface InputTodoProps {
  name?: string;
  age?: number;
  info?: { name: string; age: number };
  arr?: { name: string; age: number }[];
  listToDo: string[];
  setListToDo: (v: string[]) => void;
}

const InputTodo = (props: InputTodoProps) => {
  const { setListToDo, listToDo } = props;

  const [todo, setTodo] = useState("");

  const handleClick = () => {
    if (!todo) {
      alert("Please enter a todo");
      return;
    }

    setListToDo([...listToDo, todo]);
    setTodo("");
  };

  return (
    <div className="input-todo-container">
      <div>Add new Todo</div>
      <input
        type="text"
        placeholder="Add a new todo..."
        onChange={(e) => setTodo(e.target.value)}
        value={todo}
      />
      <button
        onClick={() => {
          handleClick();
        }}
      >
        Add
      </button>
    </div>
  );
};
export default InputTodo;
