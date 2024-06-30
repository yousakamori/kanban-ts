import { useState } from 'react';
import { type Card as CardType, type Column as ColumnType } from '../types';
import Card from './Card';
import DropIndicator from './DropIndicator';
import AddCard from './AddCard';

type Props = {
  title: string;
  headingColor: string;
  column: ColumnType;
  cards: CardType[];
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
};

export default function Column({
  title,
  headingColor,
  cards,
  column,
  setCards,
}: Props) {
  const [active, setActive] = useState<boolean>(false);

  const handleDragStart = (
    e: MouseEvent | TouchEvent | PointerEvent | DragEvent,
    card: CardType,
  ) => {
    console.log(typeof e);
    const dragEvent = e as unknown as DragEvent;
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.setData('cardId', card.id);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData('cardId');
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || '-1';

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);

      if (!cardToTransfer) {
        return;
      }

      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === '-1';

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || (getIndicators() as HTMLElement[]);

    indicators.forEach((i) => {
      i.style.opacity = '0';
    });
  };

  const highlightIndicator = (e: React.DragEvent) => {
    const indicators = getIndicators() as HTMLElement[];

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = '1';
  };

  const getNearestIndicator = (
    e: React.DragEvent,
    indicators: HTMLElement[],
  ) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );

    return el;
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="" onDragStart={(e) => console.log(e.target)}></div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`size-full transition-colors ${
          active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}

        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
}
