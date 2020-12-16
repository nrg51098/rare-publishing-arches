import React, { useContext, useState, useEffect } from "react"
import { PostContext } from "./PostProvider"
import { CategoryContext } from "../categories/CategoryProvider"
import { TagContext } from "../tags/TagProvider"


export const PostForm = (props) => {
    // Use the required context providers for data
    const { addPost, posts, updatePost, getPosts } = useContext(PostContext)
    // const { profile, getProfile } = useContext(ProfileContext)

    // Tags data
    const { tags, getTags, getTagsByPostId } = useContext(TagContext)

    // Categories data
    const { categories, getCategories } = useContext(CategoryContext)

    // Component state
    const [post, setPost] = useState({})

    // Is there a a URL parameter??
    const editMode = props.match.params.hasOwnProperty("postId")  // true or false

    const handleControlledInputChange = (event) => {
        /*
            When changing a state object or array, always create a new one
            and change state instead of modifying current one
        */
        const newPost = Object.assign({}, post)          // Create copy
        newPost[event.target.name] = event.target.value    // Modify copy
        setPost(newPost)                                 // Set copy as new state
    }

    /*
        If there is a URL parameter, then the user has chosen to
        edit an post.
            1. Get the value of the URL parameter.
            2. Use that `id` to find the post.
            3. Update component state variable.
    */
    const getPostInEditMode = () => {
        if (editMode) {
            const postId = parseInt(props.match.params.postId)
            const selectedPost = posts.find(a => a.id === postId) || {}
            setPost(selectedPost)
        }
    }

    // Get data from API when component initilizes
    useEffect(() => {
        getPosts();
        getTags();
        getCategories();
    }, [])

    // Once provider state is updated, determine the post (if edit)
    useEffect(() => {
        getPostInEditMode()
    }, [posts])


    const constructNewPost = () => {
        const now = new Date();

        if (editMode) {
            // PUT
            updatePost({
                id: post.id,
                title: post.title,
                content: post.content,
                categoryId: 1,
                publicationDate: now,
                user: post.rareuser.id,
                image_url: post.headerImgUrl
            })
                .then(() => props.history.push("/posts"))
        } else {
            // POST
            addPost({
                title: post.title,
                content: post.content,
                category_id: post.categoryId,
                image_url: post.headerImgUrl
            })
                .then(() => props.history.push("/posts"))
        }

    }

    return (
        <div className="container w-50">
            <form className="postForm">
                <h2 className="postForm__title">{editMode ? "Update Post" : "New Post"}</h2>
                <fieldset>
                    <div className="form-group">
                        <input type="text" name="title" required autoFocus className="form-control w-75"
                            placeholder="Post title"
                            defaultValue={post.title}
                            onChange={handleControlledInputChange}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <input type="text" name="headerImgUrl" className="form-control w-75"
                            placeholder="Image URL"
                            defaultValue={post.image_url}
                            onChange={handleControlledInputChange}>
                        </input>
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <textarea rows="7" type="text" name="content" required className="form-control"
                            placeholder="Article content"
                            value={post.content}
                            onChange={handleControlledInputChange}>
                        </textarea>
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <select name="categoryId" className="form-control w-50" value={(post.category && post.category.id) || "0"} onChange={handleControlledInputChange}>
                            <option value="0" disabled>Category Select</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.label}</option>
                            ))}
                        </select>
                    </div>
                </fieldset>
                <fieldset>
                    <div className="d-flex flex-row flex-wrap form-check form-check-inline mb-3">
                        <input type="checkbox" name="tag-1" className="form-check-input" />
                        <label htmlFor="tag-1" className="form-check-label">Tag1</label>
                        <input type="checkbox" name="tag-2" className="form-check-input" />
                        <label htmlFor="tag-2" className="form-check-label">Tag2</label>
                        <input type="checkbox" name="tag-3" className="form-check-input" />
                        <label htmlFor="tag-3" className="form-check-label">Tag3</label>
                        <input type="checkbox" name="tag-4" className="form-check-input" />
                        <label htmlFor="tag-4" className="form-check-label">Tag4</label>
                        <input type="checkbox" name="tag-5" className="form-check-input" />
                        <label htmlFor="tag-5" className="form-check-label">Tag5</label>
                    </div>
                </fieldset>

                <button type="submit"
                    onClick={evt => {
                        evt.preventDefault()
                        constructNewPost()
                    }}
                    className="btn btn-primary">
                    {editMode ? "Save" : "Publish"}
                </button>
            </form>
        </div>
    )
}
