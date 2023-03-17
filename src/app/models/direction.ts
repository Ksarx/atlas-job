export interface IDirection {
  id: number;
  code: string;
  name: string;
  level: string;
  description: string;
  idJobs: string[];
  semesters: {
    semNumber: number;
    disciplines: string[];
  }[];
}
