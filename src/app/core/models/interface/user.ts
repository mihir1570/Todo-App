export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date | null;
}

// Interface representing the task data
export interface AllTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  estimatedHours: string;
  status: TaskStatus;
  assignedTo: AssignedUser;
  createdBy: CreatedByUser;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// Interface representing status of task
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// Interface representing the assigned user
export interface AssignedUser {
  id: string;
  name: string;
  email: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

// Interface representing the creator of the task
export interface CreatedByUser {
  id: string;
  name: string;
  email: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
}

// Interface representing the API response
export interface TaskApiResponse {
  data: AllTask[];
  count: number;
}

// {
//   "data": [
//     {
//       "id": "6229544b-6235-474b-8efa-fac38fe20c63",
//       "title": "task number krunal task",
//       "description": "adding task details",
//       "dueDate": "2024-10-03",
//       "estimatedHours": "5",
//       "status": "COMPLETED",
//       "createdAt": "2024-10-07T09:36:14.807Z",
//       "updatedAt": "2024-10-08T09:58:26.063Z",
//       "deletedAt": null,
//       "assignedTo": {
//         "id": "9d86bd2c-4429-4a61-a1a7-a7c1bb536c80",
//         "name": "krunal",
//         "email": "krunal@gmail.com",
//         "createAt": "2024-10-06T06:30:03.295Z",
//         "updateAt": "2024-10-06T06:30:03.295Z",
//         "deleteAt": null
//       },
//       "createdBy": {
//         "id": "d9e4b403-cba3-4a9b-9ffd-dce378a4db72",
//         "name": "Jigar",
//         "email": "Jigar@gmail.com",
//         "createAt": "2024-10-06T08:19:38.664Z",
//         "updateAt": "2024-10-06T08:19:38.664Z",
//         "deleteAt": null
//       }
//     }
//   ],
//   "count": 1
// }
