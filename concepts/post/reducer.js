import * as names from './names';
import INTIAL_STATE from './state';

const postCompareFn = (a, b) => b.updateDate - a.updateDate;

export default (state = INTIAL_STATE, action) => {
    switch (action.type) {
        case names.ADD_POST:
            const newPostIndex = state.posts.findIndex(p => p.id === action.post.id);
            if (newPostIndex === -1) {
                return {
                    ...state,
                    posts: state.posts.concat(action.post).sort(postCompareFn)
                };
            };
            return state;
        case names.UPDATE_POST:
            const updatePostIndex = state.posts.findIndex(p => p.id === action.post.id);
            if (updatePostIndex !== -1) {
                const updatedPosts = [...state.posts];
                updatedPosts[updatePostIndex] = action.post;
                return {
                    ...state,
                    posts: updatedPosts.sort(postCompareFn)
                };
            };
            return state;
        case names.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(
                    p => p.id !== action.post.id
                )
            };
        default:
            return state;
    }
}