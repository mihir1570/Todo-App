export class Task {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  estimatedHours: number;
  status: TaskStatus.PENDING;

  constructor() {
    this.title = '';
    this.description = '';
    this.assignedTo = '';
    this.dueDate = new Date();
    this.estimatedHours = 0;
    this.status = TaskStatus.PENDING;
  }
}

// status
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class LoginObj {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}


