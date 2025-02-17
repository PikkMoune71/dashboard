/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRef, useEffect, useState } from "react";
import { Project } from "@/types/Project";
import { Event } from "@/types/Event";

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const projects = useSelector(
    (state: RootState) => state.projects.projects
  ) as Project[];

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const updatedEvents: Event[] = projects.flatMap(
      (project) =>
        project.tasks
          ?.filter((task) => task && task.startDate && task.endDate)
          .map((task) => {
            const startDate = new Date(task.startDate!).toISOString();
            const endDate = new Date(task.endDate!).toISOString();
            return {
              id: task.id,
              title: task.title,
              start: startDate,
              end: endDate,
              extendedProps: {
                projectName: project.title,
                projectColor: project.color,
                isMultiDay: startDate !== endDate,
                startDate: task.startDate!,
                endDate: task.endDate!,
                status: task.status,
              },
            };
          }) || []
    );

    setEvents(updatedEvents);
    console.log(projects);
  }, [projects]);

  return (
    <FullCalendar
      key={JSON.stringify(events)}
      ref={calendarRef}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridWeek"
      events={events}
      eventContent={renderEventContent}
    />
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const renderEventContent = (eventInfo: any) => {
  const { projectName, projectColor, isMultiDay, startDate, endDate, status } =
    eventInfo.event.extendedProps as Event["extendedProps"];

  return (
    <div
      style={{
        padding: "10px",
        fontSize: "12px",
        whiteSpace: "normal",
        color: "white",
        borderRadius: "15px",
        width: "100%",
      }}
      className={`${projectColor} text-white ${
        status === "done" && "opacity-50"
      }`}
    >
      <div
        style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "2px" }}
      >
        {eventInfo.event.title} {status === "done" && "✅"}{" "}
        {status === "todo" && "📝"} {status === "inProgress" && "🚧"}
      </div>
      <div className="mb-2">{projectName}</div>
      {isMultiDay && (
        <span className="text-xs">
          📅 Du {formatDate(startDate)} au {formatDate(endDate)}
        </span>
      )}
    </div>
  );
};

export default Calendar;
