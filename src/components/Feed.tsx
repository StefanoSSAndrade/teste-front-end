import React, { useState } from "react"
import { Posts } from "./Posts"
import { Users } from "./Users"
import { DataContext } from "./contexts/context"
import { CommentInterface, UsersInterface } from "./types/type"
import styles from "./Feed.module.css"

export const Feed = () => {
    const [users, setUsers] = useState<UsersInterface[]>([])
    const [posts, setPosts] = useState<UsersInterface[]>([])
    const [usersDetails, setUsersDetails] = useState<UsersInterface[]>([])
    const [comments, setComments] = useState<CommentInterface[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [actualPostId, setActualPostId] = useState<number>()

    const filteredPosts = posts.filter((post) =>
        users.some((user) => user.id == post.userId)
    );

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage: number = 10;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const [visibleComments, setVisibleComments] = useState<number[]>([]);

    const isCommentsVisible = (postId: number) => {
        if (visibleComments.includes(postId)) {
            setVisibleComments(visibleComments.filter((id) => id !== postId));
        } else {
            setVisibleComments([...visibleComments, postId]);
        }
    };

    const openModal = (userId: number) => {
        setShowModal(!showModal)
        setActualPostId(userId)
    }

    const handlePages = {
        prevPage: () => {
            setCurrentPage(currentPage - 1)
        },
        nextPage: () => {
            setCurrentPage(currentPage + 1)
        },
    }

    const [visibleButton] = useState<boolean>(false)

    return (
        <div className={styles.feed}>
            <h1>Feed</h1>
            <DataContext.Provider value={{
                users, setUsers, posts, setPosts, usersDetails, setUsersDetails, comments, setComments, showModal, setShowModal, actualPostId
            }}>
                <Posts />
                <Users />
            </DataContext.Provider>
            <article>
                {currentPosts.map((post) => {
                    const author = users.find((user) => user.id === post.userId);
                    const postComments = comments.filter((comment) => comment.postId === post.id);
                    const commentsVisible = visibleComments.includes(post.id);
                    return (
                        <div key={post.id} className={styles.feedContent}>
                            <header className={styles.feedHeader}>
                                <div>
                                    <a href="#" onClick={() => openModal(post.userId)}>
                                        <div className={styles.author}>
                                            <strong>{author?.name}</strong>
                                        </div>
                                        <span>
                                            @{author?.username}
                                        </span>
                                    </a>
                                </div>
                            </header>
                            <div className={styles.content}>
                                <h2>{post.title}</h2>
                                <p>{post.body}</p>
                            </div>
                            <div className={styles.commentContainer}>
                                <button className={styles.commentButtons} onClick={() => isCommentsVisible(post.id)}>
                                    {commentsVisible ? "Ocultar comentários" : "Carregar comentários..."}
                                </button>
                                {commentsVisible && postComments.map((comment) => (
                                    <div key={comment.id} className={styles.comment}>
                                        <h3>Comentário: </h3>
                                        <p>{comment.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                <footer className={styles.pagination}>
                    <button onClick={handlePages.prevPage} disabled={currentPage < 2 && !visibleButton}>Anterior</button>
                    <button onClick={handlePages.nextPage} disabled={currentPage > 9 && !visibleButton}>Próxima</button>
                </footer>
            </article>
        </div>
    )
}
