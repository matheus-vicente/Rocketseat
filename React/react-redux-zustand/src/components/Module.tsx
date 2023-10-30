import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";

import { Lesson } from "./Lesson";
import { play } from "../store/slices/player";
import { useAppDispatch, useAppSelector } from "../store";

interface ModuleProps {
  title: string;
  moduleIndex: number;
  amountOfLessons: number;
}

export function Module({ amountOfLessons, moduleIndex, title }: ModuleProps) {
  const dispatch = useAppDispatch();

  const { currentModuleIndex, currentLessonIndex } = useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player;

    return { currentModuleIndex, currentLessonIndex };
  });

  const lessons = useAppSelector(
    (state) => state.player.course?.modules[moduleIndex].lessons,
  );

  return (
    <Collapsible.Root className="group" defaultOpen={moduleIndex === 0}>
      <Collapsible.Trigger className="flex w-full items-center bg-zinc-800 gap-3 p-4">
        <div className="flex h-10 w-10 rounded-full items-center justify-center bg-zinc-950 text-xs">
          {moduleIndex + 1}
        </div>

        <div className="flex flex-col gap-1 text-left">
          <strong>{title}</strong>

          <span className="text-xs text-zinc-400">{amountOfLessons} aulas</span>
        </div>

        <ChevronDown className="h-5 w-5 ml-auto text-zinc-400 group-data-[state=open]:rotate-180 transition-transform" />
      </Collapsible.Trigger>

      <Collapsible.Content>
        <nav className="relative flex flex-col gap-4 p-6">
          {lessons &&
            lessons.map((lesson, lessonIndex) => {
              const isCurrent =
                currentModuleIndex === moduleIndex &&
                currentLessonIndex === lessonIndex;

              return (
                <Lesson
                  key={lesson.id}
                  title={lesson.title}
                  isCurrent={isCurrent}
                  duration={lesson.duration}
                  onPlay={() => dispatch(play([moduleIndex, lessonIndex]))}
                />
              );
            })}
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
