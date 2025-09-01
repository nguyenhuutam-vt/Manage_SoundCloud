const EricComponent = () => {
  //   const name = "Eric";

  //   const info = {
  //     age: 30,
  //     job: "Developer",
  //   };

  const arr = [1, 2, 3, 4, 5];

  return (
    <div>
      <h1>Hedy {JSON.stringify(arr)} Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights </li>
        <li>Rehearse a movie scene </li>

        <li>Improve the spectrum technology </li>
      </ul>
    </div>
  );
};

export default EricComponent;
