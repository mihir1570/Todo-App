export const Constant = {
  // Base URLs
  BASE_URL: 'https://taskly-backend-vhwk.onrender.com/api/',
  // BASE_URL: 'http://192.168.29.163:8000/api/',

  // User Authentication APIs
  USER_AUTH: {
    LOGIN: 'users/login',
    GET_ALL_USERS: 'users',
  },

  // Task APIs
  TASK_API: {
    ADD_TASK: 'task', // POST
    UPDATE_TASK: 'task', // PUT
    DELETE_TASK: 'task', // DELETE
    TASK_DETAIL: 'task', // GET, add user ID as param
    STATUS_UPDATE: 'task', // PATCH
    DUPLICATE_TASK: 'task' // POST
  },
};
