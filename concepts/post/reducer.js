import * as names from './names';
import INTIAL_STATE from './state';

export default (state = INTIAL_STATE, action) => {
    switch (action.type) {
        case names.SET_POSTS:
            return {
                ...state,
                posts: action.posts,
                selectedPost: null
            };
        case names.ADD_POST:
            const newPostIndex = state.posts.findIndex(p => p.id === action.post.id);
            if (newPostIndex === -1) {
                return {
                    ...state,
                    posts: [action.post].concat(state.posts)
                };
            };
            return state;
        case names.UPDATE_POST:
            const updatePostIndex = state.posts.findIndex(p => p.id === action.post.id);
            if (updatePostIndex !== -1) {
                const updatedPosts = [...state.posts];
                updatedPosts.splice(updatePostIndex, 1);
                return {
                    ...state,
                    posts: [action.post].concat(updatedPosts),
                    selectedPost: state.selectedPost && state.selectedPost.id == action.post.id ? action.post : state.selectedPost
                };
            };
            return state;
        case names.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(
                    p => p.id !== action.post.id
                ),
                selectedPost: state.selectedPost && state.selectedPost.id == action.post.id ? null : state.selectedPost
            };
        case names.SELECT_POST:
            return {
                ...state,
                selectedPost: action.post
            }
        default:
            return state;
    }
}