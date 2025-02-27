import { useUser } from "@/composables/useFetchUser";

export default function CalendarDownload() {
  const { user } = useUser();

  if (!user) return null;

  const downloadUrl = `/api/calendar/${user.calendarToken}`;

  return (
    <button
      onClick={() => (window.location.href = downloadUrl)}
      className="btn"
    >
      Télécharger mon calendrier
    </button>
  );
}
