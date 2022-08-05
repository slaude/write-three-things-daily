import classNames from 'classnames';
import { useState, useCallback, FormEventHandler, useEffect, useMemo } from 'react';

import { useTranslation, Trans } from "react-i18next";

import './App.css';

import { Input } from "./components/Input";
import { ReadThings } from './components/ReadThings';

import { useThings } from './services/getThings';
import { persistThings } from './services/persistThings';
import type { WrittenRecord } from './services/types';

const YOU_MUST_TYPE_THIS_MANY_CHARACTERS = 3;

type EditState = "editing" | "confirming" | "saving" | "confirmed" | "viewing";

function App() {
  const { t } = useTranslation();

  const [today] = useState(() => {
    return (new Date()).toISOString().split("T")[0];
  })
  const { data, invalidate } = useThings();

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
    invalidate();

    setEditState(success ? "confirmed"  : "confirming");
  }, [invalidate]);

  return (
    <div className="App max-w-screen-lg mx-auto px-3">
      {(editState === "editing" || editState === "confirming" || editState === "saving") && (
        <>
          <h1 className="text-3xl m-4 font-bold text-center">
            {t("app-title")}
          </h1>
          <form className="container mx-auto flex flex-col items-center" onSubmit={handleSubmit}>
            <Input
              placeholder={t("first-placeholder")}
              name="first"
              value={first}
              disabled={editState !== "editing"}
              onChange={setFirst}
            />
            <Input
              placeholder={disableSecond ? "" : t("second-placeholder")}
              name="second"
              value={second}
              disabled={disableSecond || editState !== "editing"}
              onChange={setSecond}
            />
            <Input
              placeholder={disableThird ? "" : t("third-placeholder")}
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
                  disabled={disableSubmit}
                  onClick={(e) => {
                    setEditState("confirming")
                    e.preventDefault();
                  }}
                >
                  {disableSubmit ? t("submit-disabled"): t("submit-enabled")}
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
                    {t("edit-things")}
                  </button>
                  <button
                    className="flex-1 ml-1 text-center rounded font-bold p-2 text-white bg-green-600"
                    type="submit"
                  >
                    {t("submit-things")}
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
            {t("app-title-confirmed-today")}
          </h1>
          <div className="text-slate-500 text-center">
            <CountdownTimer />
          </div>
          <ReadThings first={first} second={second} third={third} />
          {hasPastData && (
            <div className="mx-auto container">
              <button
                className="w-full rounded font-bold p-2 text-white bg-cyan-800"
                onClick={() => setEditState("viewing")}
              >
                {t("view-past-things")}
              </button>
            </div>
          )}
        </>
      )}
      {editState === "viewing" && data !== null && (
        <PreviousThings today={today} data={data} />
      )}
    </div>
  );
}

const constructTimeRemaining = (remaining: number): string => {
  const parts: string[] = [];

  let hourPart;

  // eslint-disable-next-line no-cond-assign
  if (hourPart = Math.floor(remaining / (60 * 60))) {
    parts.push(""+hourPart);
  }
  parts.push((""+Math.floor(remaining / 60) % 60).padStart(2, "0"));
  parts.push((""+remaining % 60).padStart(2, "0"));

  return parts.join(":");
};

const CountdownTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState("...");

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setMilliseconds(0);
    tomorrow.setSeconds(0);
    tomorrow.setMinutes(0);
    tomorrow.setHours(0);

    const interval = setInterval(() => {
      const difference = tomorrow.valueOf() - Date.now();
      const seconds = Math.floor(difference / 1000);

      setTimeRemaining(constructTimeRemaining(seconds));
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [])

  return (
    <Trans i18nKey="countdown-to-next-day">
      (You can write your next three things in {{timeRemaining}})
    </Trans>
  );
};

interface PreviousThingsProps {
  today: string;
  data: WrittenRecord[];
}

const PreviousThings = ({ today, data }: PreviousThingsProps): React.ReactElement => {
  const { t } = useTranslation();

  const [offset, setOffset] = useState(() => {
    const todayOffset = data.findIndex((datum) => datum.date === today);
    
    return todayOffset > -1 ? todayOffset - 1 : data.length - 1;
  });
  const datum = useMemo(() => {
    return data[offset];
  }, [data, offset]);
  
  const disablePrevious = offset === 0;
  const disableNext = offset >= data.length -1;

  const { date } = datum;
  
  return (
    <>
      <h1 className="text-3xl m-4 font-bold text-center">
        <Trans i18nKey="app-title-for-date">
          Here's what you wrote on {{date}}
        </Trans>
      </h1>
      <ReadThings first={datum.things[0]} second={datum.things[1]} third={datum.things[2]} />
      <div className="mx-auto container flex justify-between">
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
          {t("previous-things")}
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
          {t("next-things")}
        </button>
      </div>
    </>
  );
};

export default App;
