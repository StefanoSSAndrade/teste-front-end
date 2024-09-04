import { useEffect, useState, useContext } from "react"
import styles from "./Posts.module.css"
import { DataContext } from "./contexts/context";
import { CommentInterface, PostInterface } from "./types/type";

export const Posts = () => {

    const { setPosts } = useContext(DataContext);
    const { setComments } = useContext(DataContext);

    const URLPosts = "https://jsonplaceholder.typicode.com/posts"

    useEffect(() => {
        const fetchData = async () => {
            const postsResponse = await fetch(URLPosts)

            const postsData: PostInterface[] = await postsResponse.json();

            const commentsData = await Promise.all(
                postsData.map((post: PostInterface) => fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`).then((response) => response.json()),
                )
            )

            setPosts(postsData);
            setComments(commentsData.flat());
        }

        fetchData()
    }, [])

    return (
        <></>
    );
}
