"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Chapter } from "@workspace/types";
import { Badge, Grip, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ChaptersListDnd = ({
  items,
  onReorder,
  onEdit,
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    if (!reorderedItem) return;
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={`mb-4 flex items-center gap-x-2 rounded-md border text-sm ${chapter.isPublished && "border-blue-200 bg-blue-100 text-blue-700"} dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:${chapter.isPublished && "border-blue-600 bg-blue-800 text-blue-300"} `}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={`rounded-l-md border-r px-2 py-3 transition ${chapter.isPublished && ""} "}`}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {chapter.isFree && <Badge>Free</Badge>}
                      <Badge
                        className={``}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className="h-4 w-4 cursor-pointer transition hover:opacity-75"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
