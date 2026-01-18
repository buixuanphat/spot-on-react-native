const MyCommentReducer = (state, action) => {
    switch (action.type) {
        case 'reply':
            return {
                ...state,
                parentId: action.payload.parentId,
                responseName: action.payload.responseName,
            };
        case 'view':
            return {
                ...state,
                postId: action.payload.postId
            };
        case 'done':
            return {
                ...state,
                responseName: null,
                parentId: null
            };
        default:
            return state;
    }
};

export default MyCommentReducer;
