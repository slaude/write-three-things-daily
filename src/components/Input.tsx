import React, { useState } from "react";

import classnames from "classnames";

interface InputProps extends Partial<HTMLTextAreaElement> {
  onChange: (value: string) => void;
}

/**
 * @note by my reckoning, this will cause localStorage to exhaust after 3,333 days, which
 *   should be sufficient
 */
const DONT_WRITE_MORE_THAN_THESE_MANY_CHARS = 500;

export const Input = ({ name, placeholder, value = "", disabled, onChange }: InputProps): React.ReactElement => {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <div className={classnames("w-full", "mb-1")}>
      <textarea
        name={name}
        placeholder={placeholder}
        className={classnames("border-2 p-2 rounded resize-none w-full", { "cursor-n-resize": disabled })}
        disabled={disabled}
        value={value}
        maxLength={DONT_WRITE_MORE_THAN_THESE_MANY_CHARS}
        rows={5}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
      />
      <div className={classnames("text-slate-400 text-sm leading-5", { "invisible": !hasFocus, "visible": hasFocus })}>
        {value.length} / {DONT_WRITE_MORE_THAN_THESE_MANY_CHARS}
      </div>
    </div>
  );
};
