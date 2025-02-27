import { useUser } from "@/composables/useFetchUser";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

export default function CalendarDownload() {
  const { user } = useUser();

  if (!user) return null;

  const downloadUrl = `/api/calendar/${user.calendarToken}`;

  return (
    <Button
      onClick={() => (window.location.href = downloadUrl)}
      variant="outline"
    >
      <Download /> Télécharger mon calendrier (.ics)
    </Button>
  );
}
