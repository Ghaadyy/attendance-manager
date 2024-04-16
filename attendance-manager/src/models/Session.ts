export type Session = {
  id: number;
  name: string;
  description?: string;
  courseId: number;
  teacherId: number;
  startDate: string;
  endDate: string;
};
