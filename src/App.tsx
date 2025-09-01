import { useState } from "react";
import InputTodo from "./todo/input.todo";

function App() {
  const [listToDo, setListToDo] = useState<string[]>([]);

  return (
    <div>
      <InputTodo listToDo={listToDo} setListToDo={setListToDo}>
   
      </InputTodo>

      <ul>
        {listToDo.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
