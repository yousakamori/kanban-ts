import { motion } from 'framer-motion';
import { type Card as CardType, type Column as ColumnType } from '../types';
import DropIndicator from './DropIndicator';

type Props = {
  title: string;
  id: string;
  column: ColumnType;
  handleDragStart: (
    event: MouseEvent | TouchEvent | PointerEvent | DragEvent,
    card: CardType,
  ) => void;
};

export default function Card({ title, id, column, handleDragStart }: Props) {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
}
