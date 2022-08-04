import classNames from 'classnames';
import { useState, useCallback, FormEventHandler } from 'react';
import './App.css';

import { Input } from "./components/Input";

const YOU_MUST_TYPE_THIS_MANY_CHARACTERS = 3;

function App() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  const [editState, setEditState] = useState<"editing" | "confirming" | "confirmed">("editing");

  const disableSecond = first.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;
  const disableThird = disableSecond || second.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;
  const disableSubmit = disableSecond || disableThird || third.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>((e) => {
    setEditState("confirmed");
    const [firstValue, secondValue, thirdValue] = Array.from(e.target as any).map((n: any) => n.value);

    console.log("committed", firstValue, secondValue, thirdValue);

    e.preventDefault();
  }, []);

  return (
    <div className="App max-w-screen-lg mx-auto">
      <h1 className="text-3xl m-4 font-bold text-center">
        {editState === "confirmed" ? "The three things you wrote today:" : "Write exactly three things a day"}
      </h1>
      <form className="container mx-auto flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="w-full">
          <Input
            placeholder="Write your first thing"
            name="first"
            value={first}
            disabled={editState !== "editing"}
            onChange={setFirst}
          />
        </div>
        <div className="w-full">
          <Input
            placeholder={disableSecond ? "" : "Next, write your second thing"}
            name="second"
            value={second}
            disabled={disableSecond || editState !== "editing"}
            onChange={setSecond}
          />
        </div>
        <div className="w-full">
          <Input
            placeholder={disableThird ? "" : "Finally, write your third thing"}
            name="third"
            value={third}
            disabled={disableThird || editState !== "editing"}
            onChange={setThird}
          />
        </div>
        <div className="w-full flex justify-between">
          {editState === "editing" && (
            <button
              type="button"
              className={
                classNames(
                  "text-center w-full rounded font-bold p-2 text-white bg-cyan-800",
                  {
                    "text-slate-500": disableSubmit,
                    "cursor-n-resize": disableSubmit,
                    "bg-slate-300": disableSubmit
                  }
                )
              }
              aria-label="Commit your writings"
              disabled={disableSubmit}
              onClick={(e) => {
                setEditState("confirming")
                e.preventDefault();
              }}
            >
              {disableSubmit ? "You're not quite there": "That's it for today"}
            </button>
          )}
          {editState === "confirming" && (
            <>
              <button
                className="flex-1 mr-1 text-center rounded font-bold p-2 text-white bg-red-600"
                onClick={(e) => {
                  setEditState("editing")
                  e.preventDefault()
                }}
              >
                Make some edits
              </button>
              <button
                className="flex-1 ml-1 text-center rounded font-bold p-2 text-white bg-green-600"
                type="submit"
              >
                Submit my three things
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
