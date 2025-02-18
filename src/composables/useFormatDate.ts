export const formatDateToFrench = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatDateToISO = (date: string | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};
