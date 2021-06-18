export const initialState = {
  token: "",
  user: {
    fullname: "",
    username: "",
  },
  authenticate: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TOKEN":
      return {
        ...state,
        token: action.item,
        authenticate: true,
      };
      break;

    case "UPDATE_USER":
      return {
        ...state,
        user: {
          fullname: action.item.fullname,
          username: action.item.username,
        },
      };
      break;

    case "LOGOUT_REQUEST":
      return {
        ...initialState,
      };
      break;

    default:
      return state;
  }
};

export default reducer;
