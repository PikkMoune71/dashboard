import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import ical from "ical-generator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const token = (await params).token;

  const usersQuery = query(
    collection(db, "users"),
    where("calendarToken", "==", token)
  );
  const userSnapshot = await getDocs(usersQuery);

  if (userSnapshot.empty) {
    return NextResponse.json(
      { message: "Utilisateur non trouvé" },
      { status: 404 }
    );
  }

  const user = userSnapshot.docs[0].data();
  const userId = userSnapshot.docs[0].id;
  const calendar = ical({
    name: `Calendrier de ${user.firstName} ${user.lastName}`,
    timezone: "Europe/Paris",
  });

  const projectsQuery = query(
    collection(db, "projects"),
    where("userId", "==", userId)
  );
  const projectsSnapshot = await getDocs(projectsQuery);
  const projectIds = projectsSnapshot.docs.map((doc) => doc.id);

  const tasksQuery = query(
    collection(db, "tasks"),
    where("projectId", "in", projectIds)
  );
  const tasksSnapshot = await getDocs(tasksQuery);

  tasksSnapshot.docs.forEach((doc) => {
    const task = doc.data();
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);

    // Vérification si startDate et endDate sont valides
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error(`Invalid date for task: ${task.title}`);
      return; // Skip this task if dates are invalid
    }

    calendar.createEvent({
      summary: task.title,
      start: startDate,
      end: endDate,
      description: task.description,
      allDay: true,
    });
  });

  return new NextResponse(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="calendar.ics"`,
    },
  });
}
