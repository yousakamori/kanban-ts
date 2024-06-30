export type Column = 'backlog' | 'todo' | 'doing' | 'done';

export type Card = {
  title: string;
  id: string;
  column: Column;
};
