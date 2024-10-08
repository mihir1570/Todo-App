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
