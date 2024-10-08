export const Constant = {
  // Base URLs
  BASE_URL: 'https://taskly-backend-vhwk.onrender.com/api/',

  // User Authentication APIs
  USER_AUTH: {
    LOGIN: 'users/login',
    GET_ALL_USERS: 'users',
  },

  // Task APIs
  TASK_API: {
    GET_ALL_TASKS: 'task/alltask',
    ADD_TASK: 'task', // POST
    UPDATE_TASK: 'task', // PUT
    DELETE_TASK: 'task', // DELETE
    ASSIGN_ME: 'task', // GET, add user ID as param
  },
};
