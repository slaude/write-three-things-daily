import React from "react";

import classnames from "classnames";

interface InputProps extends Partial<HTMLTextAreaElement> {
  onChange: (value: string) => void;
}

export const Input = ({ name, placeholder, value, disabled, onChange }: InputProps): React.ReactElement => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      className={classnames("border-2 p-2 rounded resize-none w-full", { "cursor-n-resize": disabled })}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
