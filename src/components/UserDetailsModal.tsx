import { useEffect, useState, useContext } from "react";
import styles from "./UserDetailsModal.module.css"
import { UsersInterface } from "./types/type";
import { DataContext } from "./contexts/context";

type Props = {
    onClose: () => void;
}

export const UserDetailsModal = ({ onClose }: Props) => {
    const { users } = useContext(DataContext)
    const { actualPostId } = useContext(DataContext)

    const [usersDetails, setUsersDetails] = useState<UsersInterface[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const usersDetailsResponse = await fetch(`https://jsonplaceholder.typicode.com/users/`)

            const usersDetailsData: UsersInterface[] = await usersDetailsResponse.json();

            setUsersDetails(usersDetailsData.flat())
        }
        fetchData()

    }, [])


    const filteredDetails = usersDetails.filter((detail) =>
        users.some((user: UsersInterface) => user.id == detail.id)
    );


    return (
        <div className={styles.modal}>
            <div className={styles["modal-content"]}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                {filteredDetails.map((post) => {
                    if (post.id === actualPostId) {
                        const author = users.find((user: UsersInterface) => user.id === post.id);
                        return (
                            <div key={post.id}>
                                <header className={styles.author}>
                                    <div className={styles.name}>
                                        <strong>{author?.name}</strong>
                                    </div>
                                    <div className={styles.username}>
                                        @{author?.username}
                                    </div>
                                </header>
                                <div className={styles.detailsContent}>

                                    <div>
                                        <span>E-mail: {author.email}</span>
                                        <div className={styles.address}>
                                            Rua: {author.address.street}, {author.address.suite}, cidade de {author.address.city}, código postal: {author.address.zipcode}
                                        </div>
                                        <div>
                                            Coordenadas: latitude {author.address.geo.lat} longitude: {author.address.geo.lng}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    )
}