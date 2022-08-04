import classNames from 'classnames';
import { useState, useCallback, FormEventHandler } from 'react';
import './App.css';

import { Input } from "./components/Input";

const YOU_MUST_TYPE_THIS_MANY_CHARACTERS = 3;

function App() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  const disableSecond = first.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;
  const disableThird = disableSecond || second.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;
  const disableSumbit = disableSecond || disableThird || third.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>((e) => {
    const [firstValue, secondValue, thirdValue] = Array.from(e.target as any).map((n: any) => n.value);

    console.log("committed", firstValue, secondValue, thirdValue);

    e.preventDefault();
  }, []);

  return (
    <div className="App">
      <h1 className="text-3xl m-4 font-bold text-center">Write exactly three things a day</h1>
      <form className="container mx-auto flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="">
          <Input name="first" value={first} onChange={setFirst} />
        </div>
        <div>
          <Input name="second" value={second} disabled={disableSecond} onChange={setSecond} />
        </div>
        <div>
          <Input name="third" value={third} disabled={disableThird} onChange={setThird} />
        </div>
        <div>
          <button
            type="submit"
            className={classNames("", { "text-slate-500": disableSumbit, "cursor-n-resize": disableSumbit })}
            aria-label="Commit your writings"
            disabled={disableSumbit}
          >
            That's it for today
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
