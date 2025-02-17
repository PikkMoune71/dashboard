"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMemo } from "react";

const generateColor = (projectId: string) => {
  const colors = [
    "#ffadad",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff",
  ];
  return colors[parseInt(projectId, 16) % colors.length] || "#ccc";
};

const darkenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  let r = (num >> 16) - amt;
  let g = ((num >> 8) & 0x00ff) - amt;
  let b = (num & 0x0000ff) - amt;

  r = Math.max(r, 0);
  g = Math.max(g, 0);
  b = Math.max(b, 0);

  return `rgb(${r}, ${g}, ${b})`;
};

const Calendar = () => {
  const projects = useSelector((state: RootState) => state.projects.projects);

  const events = useMemo(() => {
    return projects
      .flatMap((project) =>
        project?.tasks?.map((task) => {
          if (task?.startDate && task?.endDate && task?.status !== "done") {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);

            const isMultiDay = startDate.getDate() !== endDate.getDate();
            const projectColor = generateColor(project.id ?? "");

            return {
              title: task.title,
              start: task.startDate,
              end: task.endDate,
              backgroundColor: projectColor,
              borderColor: projectColor,
              extendedProps: {
                projectName: project.title,
                isMultiDay,
                projectColor,
                startDate: task.startDate,
                endDate: task.endDate,
              },
            };
          }
          return undefined;
        })
      )
      .filter((event) => event !== undefined);
  }, [projects]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridWeek"
      events={events}
      eventContent={renderEventContent}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderEventContent = (eventInfo: any) => {
  const { projectName, projectColor, isMultiDay, startDate, endDate } =
    eventInfo.event.extendedProps;

  const darkerTextColor = darkenColor(projectColor, 60);

  return (
    <div
      style={{
        padding: "6px",
        fontSize: "12px",
        whiteSpace: "normal",
        backgroundColor: projectColor,
        color: darkerTextColor,
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "13px",
          marginBottom: "2px",
        }}
      >
        {eventInfo.event.title}
      </div>
      <div>{projectName}</div>
      {isMultiDay && (
        <span style={{ fontSize: "10px", opacity: 0.7 }}>
          📅 {startDate} - {endDate}
        </span>
      )}
    </div>
  );
};

export default Calendar;
