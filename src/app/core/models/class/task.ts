export class Task {
  title: string;
  description: string;
  assignedTo: string; // UUID of the user (User.id)
  dueDate: Date;
  estimatedHours: number;
  status: 'PENDING' | 'in_progress' | 'completed'; // Enum types for task status
  createdBy: string; // UUID of the user (User.id)

  constructor() {
    this.title = '';
    this.description = '';
    this.assignedTo = ''; // To be set when assigning
    this.dueDate = new Date();
    this.estimatedHours = 0;
    this.status = 'PENDING'; // Default status 'pending'
    this.createdBy = ''; // Assign the creator's ID
  }
}


export class LoginObj {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}
