/**
 * @fileoverview a component to display the things
 */

interface ReadThingsProps {
  first: string;
  second: string;
  third: string;
}

export const ReadThings = ({ first, second, third }: ReadThingsProps): React.ReactElement => {
  return (
    <ol className="container mx-auto flex flex-col items-center">
      <li className="w-full mb-4">
        {first}
      </li>
      <li className="w-full mb-4">
        {second}
      </li>
      <li className="w-full mb-4">
        {third}
      </li>
    </ol>
  );
};
