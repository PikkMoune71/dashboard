export interface Event {
  id?: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    projectName: string;
    projectColor?: string;
    isMultiDay: boolean;
    startDate: string;
    endDate: string;
    status: string;
  };
}
