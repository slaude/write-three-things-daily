import classNames from 'classnames';
import { useState, useCallback, FormEventHandler, useEffect, useMemo } from 'react';
import './App.css';

import { Input } from "./components/Input";
import { ReadThings } from './components/ReadThings';

import { useThings } from './services/getThings';
import { persistThings } from './services/persistThings';
import type { WrittenRecord } from './services/types';

const YOU_MUST_TYPE_THIS_MANY_CHARACTERS = 3;

type EditState = "editing" | "confirming" | "saving" | "confirmed" | "viewing";

function App() {
  const [today] = useState(() => {
    return (new Date()).toISOString().split("T")[0];
  })
  const { data } = useThings();

  useEffect(() => {
    if (data) {
      const todaysThings = data.find(({ date }) => date === today);

      if (todaysThings) {
        setEditState("confirmed");
        setFirst(todaysThings.things[0]);
        setSecond(todaysThings.things[1]);
        setThird(todaysThings.things[2]);
      }

      setHasPastData(todaysThings ? data.length > 1 : data.length > 0);
    }
  }, [today, data]);

  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");

  const [editState, setEditState] = useState<EditState>("editing");
  const [hasPastData, setHasPastData] = useState(false);

  const disableSecond = first.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;
  const disableThird = disableSecond || second.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;
  const disableSubmit = disableSecond || disableThird || third.length < YOU_MUST_TYPE_THIS_MANY_CHARACTERS;

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async (e) => {
    e.preventDefault();
    setEditState("saving");
    const [firstValue, secondValue, thirdValue] = Array.from(e.target as any).map((n: any) => n.value);
    const { success } = await persistThings([firstValue, secondValue, thirdValue]);

    setEditState(success ? "confirmed"  : "confirming");
  }, []);

  return (
    <div className="App max-w-screen-lg mx-auto">
      {(editState === "editing" || editState === "confirming" || editState === "saving") && (
        <>
          <h1 className="text-3xl m-4 font-bold text-center">
            Write exactly three things a day
          </h1>
          <form className="container mx-auto flex flex-col items-center" onSubmit={handleSubmit}>
            <Input
              placeholder="Write your first thing"
              name="first"
              value={first}
              disabled={editState !== "editing"}
              onChange={setFirst}
            />
            <Input
              placeholder={disableSecond ? "" : "Next, write your second thing"}
              name="second"
              value={second}
              disabled={disableSecond || editState !== "editing"}
              onChange={setSecond}
            />
            <Input
              placeholder={disableThird ? "" : "Finally, write your third thing"}
              name="third"
              value={third}
              disabled={disableThird || editState !== "editing"}
              onChange={setThird}
            />
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
        </>
      )}
      {editState === "confirmed" && (
        <>
          <h1 className="text-3xl m-4 font-bold text-center">
            The three things you wrote today:
          </h1>
          <ReadThings first={first} second={second} third={third} />
          {hasPastData && (
            <button
              className="text-center w-full rounded font-bold p-2 text-white bg-cyan-800"
              onClick={() => setEditState("viewing")}
            >
              See what you've written in the past
            </button>
          )}
        </>
      )}
      {editState === "viewing" && data !== null && (
        <PreviousThings today={today} data={data} />
      )}
    </div>
  );
}

interface PreviousThingsProps {
  today: string;
  data: WrittenRecord[];
}

const PreviousThings = ({ today, data }: PreviousThingsProps): React.ReactElement => {
  const [offset, setOffset] = useState(() => {
    const todayOffset = data.findIndex((datum) => datum.date === today);
    
    return todayOffset > -1 ? todayOffset - 1 : data.length - 1;
  });
  const datum = useMemo(() => {
    return data[offset];
  }, [data, offset]);
  
  const disablePrevious = offset === 0;
  const disableNext = offset >= data.length -1;
  
  return (
    <>
      <h1 className="text-3xl m-4 font-bold text-center">
        Here's what you wrote on {datum.date}:
      </h1>
      <ReadThings first={datum.things[0]} second={datum.things[1]} third={datum.things[2]} />
      <div className="w-full flex justify-between">
        <button
          className={classNames('text-center mr-1 w-full rounded font-bold p-2 text-white bg-cyan-800', {
            "text-slate-500": disablePrevious,
            "bg-slate-300": disablePrevious
          })}
          disabled={disablePrevious}
          onClick={() => {
            setOffset(current => current - 1)
          }}
        >
          See previous things
        </button>
        <button
          className={classNames('text-center ml-1 w-full rounded font-bold p-2 text-white bg-cyan-800', {
            "text-slate-500": disableNext,
            "bg-slate-300": disableNext
          })}
          disabled={disableNext}
          onClick={() => {
            setOffset(current => current + 1)
          }}
        >
          See next things
        </button>
      </div>
    </>
  );
};

export default App;
