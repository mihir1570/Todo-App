export const Constant = {
  // ======/Product End Points/========= //
  API_END_POINT: 'https://ecommerce-project-seven-pi.vercel.app/api/product/',
  METHODS: {
    CREATE_PRODUCT: '',
    DELETE_PRODUCT: '',
    UPDATE_PRODUCT: '',
    PRODUCT_DETAIL_BY_ID: '',
  },

  // ======/Product Category End Points/========= //
  CATEGORY_LIST: 'https://ecommerce-project-seven-pi.vercel.app/api/category/',
  CATEGORY_METHODS: {
    GET_ALL_CATEGORY: '',
    CREATE_CATEGORY: '',
    DELETE_CATEGORY: '',
    UPDATE_CATEGORY: '',
    GET_ALL_PRODUCTS_BY_CATEGORY: '',
  },

  //===============/CART/============== //
  CART_LIST: 'https://ecommerce-project-seven-pi.vercel.app/api/cart/',
  CART_METHODS: {
    ADD_TO_CART: '',
    GET_CART_BY_CUST_ID: '',
    REMOVE_CART: '',
    UPDATE_CART: '',
  },

  // ======/User Authentication End Points/========= //
  USER_AUTHENTICATION: 'https://ecommerce-project-seven-pi.vercel.app/api/users/',
  USERAUTH: {
    USER_SIGNUP: 'signup',
    OPT_VERIFY: 'verify',
    USER_LOGIN: 'login',
    FORGOT_PASSWORD: 'forgotpassword',
    SEND_EMAIL_FORGOT_PASS: '',
  },

  // ======/Admin Authentication End Points/========= //
  ADMIN_AUTHENTICATION: 'https://ecommerce-project-seven-pi.vercel.app/api/users/',
  ADMIN_AUTH: {
    ADMIN_LOGIN: 'Adminlogin',
  },

  // ======== Users in Admin Panel =========//
  USER_LIST: 'https://ecommerce-project-seven-pi.vercel.app/api/users/',
  USER_METHODS: {
    GET_ALL_USER: '',
  },

  // ====== Check Out ====== //
  CHECK_OUT: 'https://ecommerce-project-seven-pi.vercel.app/api/address/',
  CHECK_OUT_METHODS: {
    ADD_ADDRESS: '',
    MAKE_DEFAULT: '/make-default',
    GET_ADDRESS_BY_ID: '',
    UPDATE_ADDRESS: '',
    REMOVE_ADDRESS: '',
  },
};
