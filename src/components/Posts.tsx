import { useEffect, useState } from "react"
import styles from "./Posts.module.css"

export const Posts = () => {

    const [users, setUsers] = useState<UsersInterface[]>([]);
    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [comments, setComments] = useState<CommentInterface[]>([]);
    const URLPosts = "https://jsonplaceholder.typicode.com/posts"
    const URLUsers = "https://jsonplaceholder.typicode.com/users"

    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage: number = 10;

    interface PostInterface {
        id: number;
        title: string;
        userId: number;
        body: string;
    }
    interface UsersInterface {
        id: number;
        name: string;
        username: string;
    }
    interface CommentInterface {
        postId: number;
        id: number;
        name: string;
        email: string;
        body: string;
    }

    useEffect(() => {
        const fetchData = async () => {
            const [usersResponse, postsResponse] = await Promise.all([
                fetch(URLUsers),
                fetch(URLPosts)
            ])

            const usersData: UsersInterface[] = await usersResponse.json();
            const postsData: PostInterface[] = await postsResponse.json();

            const commentsData = await Promise.all(
                postsData.map((post: PostInterface) => fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`).then((response) => response.json()),
                )
            )

            setUsers(usersData);
            setPosts(postsData);
            setComments(commentsData.flat());

        }

        fetchData()
    }, [])

    const filteredPosts = posts.filter((post) =>
        users.some((user) => user.id == post.userId)
    );

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
    
    return (
        <div className={styles.post}>
            <article className={styles.articlePost}>
                {currentPosts.map((post) => {
                    const author = users.find((user) => user.id === post.userId);
                    const postComments = comments.filter((comment) => comment.postId === post.id);
                    const commentsVisible = visibleComments.includes(post.id);
                    return (
                        <div key={post.id} className={styles.postContent}>
                            <header>
                                <div className={styles.postAuthor}>
                                    <strong>{author?.name}</strong>
                                    <a href="#">@{author?.username}</a>
                                </div>
                            </header>
                            <div>
                                <h2>{post.title}</h2>
                                <p>{post.body}</p>
                            </div>
                            <button onClick={() => isCommentsVisible(post.id)}>
                                {commentsVisible ? "Ocultar comentários" : "Carregar comentários..."}
                            </button>
                            {commentsVisible && postComments.map((comment) => (
                                <div key={comment.id} className={styles.show}>
                                    <strong>Comentário: </strong>
                                    <p className={styles.commentsParagraph}>{comment.body}</p>
                                </div>
                            ))}
                        </div>
                    );
                })}
                <button onClick={() => setCurrentPage(currentPage < 0 ? currentPage + 1 : currentPage - 1)}>Anterior</button>
                <button onClick={() => setCurrentPage(currentPage > 10 ? currentPage - 1 : currentPage - 1)}>Próxima</button>
            </article>
        </div>
    );
}
