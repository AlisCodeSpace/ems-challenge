import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import "@schedule-x/theme-default/dist/index.css";
import { useEffect, useState } from "react";
import type { CalendarEvent } from "~/types/Calendar";

interface CalendarAppProps {
  events: CalendarEvent[]
}

function CalendarApp({ events }: CalendarAppProps) {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events, // Pass database events here
    plugins: [eventsService],
  });

  useEffect(() => {
    eventsService.getAll();
  }, []);

  return (
    <div className="bg-white shadow-md rounded p-4">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;
