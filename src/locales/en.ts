export const defaultLocale = {
  "app-title": "Write exactly three things a day",
  "first-placeholder": "Write your first thing",
  "second-placeholder": "Next, write your second thing",
  "third-placeholder": "Finally, write your third thing",
  "submit-disabled": "You're not quite there",
  "submit-enabled": "That's it for today",
  "edit-things": "Make some edits",
  "submit-things": "Submit my three things",
  "app-title-confirmed-today": "The three things you wrote today:",
  "view-past-things": "See what you've written in the past",
  "app-title-for-date": "Here's what you wrote on {{date}}",
  "previous-things": "See previous things",
  "next-things": "See next things",
} as const;

export type I18nStrings = keyof typeof defaultLocale;
