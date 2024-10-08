export interface User {
  id: string;
  name: string;
  email: string;
}

export interface GetAllUser {}


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

// Interface representing the task data
export interface AllTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  estimatedHours: string;
  status: 'COMPLETED' | 'PENDING' | 'IN_PROGRESS';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  assignedTo: AssignedUser;
  createdBy: CreatedByUser;
}

// Interface representing the API response
export interface TaskApiResponse {
  data: AllTask[];
  count: number;
}
