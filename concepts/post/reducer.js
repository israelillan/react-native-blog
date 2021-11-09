import * as names from './names'
import INTIAL_STATE from './state'

export default (state = INTIAL_STATE, action) => {
    switch (action.type) {
        case names.SET_POSTS:
            return {
                posts: action.posts,
                userPosts: action.posts.filter(post => post.authorId === userId)
            }
        default:
            return state;
    }
}