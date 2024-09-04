import { useState, useEffect, useContext } from "react"
import { DataContext } from "./contexts/context";
import { UsersInterface } from "./types/type";
import { UserDetailsModal } from "./UserDetailsModal";


export const Users = () => {
    
    const { setUsers } = useContext(DataContext)
    const { setUsersDetails } = useContext(DataContext)
    const URLUsers = "https://jsonplaceholder.typicode.com/users"
    const {showModal, setShowModal} = useContext(DataContext)

    const onCloseModal = () => {
        setShowModal(!showModal)
    }
    
    useEffect(() => {
        const fetchData = async () => {
            const usersResponse = await fetch(URLUsers)

            const usersData: UsersInterface[] = await usersResponse.json();

            const usersDetailsData = await Promise.all(
                usersData.map((user: UsersInterface) => fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`).then((response) => response.json()),
                )
            )

            setUsers(usersData);
            setUsersDetails(usersDetailsData.flat());
        }
        fetchData()
    }, [])

    return <>
        {showModal === true && <UserDetailsModal onClose={onCloseModal} />}
    </>
}
