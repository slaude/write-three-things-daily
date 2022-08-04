/**
 * @todo refine this
 */
type ISODateString = string;

export interface WrittenRecord {
  things: [string, string, string],
  date: ISODateString;
}