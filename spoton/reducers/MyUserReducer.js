

const MyUserReducer = (state, action) => {
    switch (action.type) {
        case "login":
            return {
                token: action.payload.token,
                user: action.payload.user,
            };

        case "updateUser":
            return {
                ...state,
                user: action.payload.user,
            };

        case "logout":
            return {
                token: null,
                user: null,
            };

        case "update":
            return {
                ...state,
                user: action.payload.user,
            };

        default:
            return state;
    }
};

export default MyUserReducer;
