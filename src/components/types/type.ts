export interface GlobalInterface {
    id: number;
    name: string;
    username: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: number;
        geo: {
            lat: number;
            lng: number;
        }
    };
}

export interface PostInterface extends GlobalInterface {
    title: string;
    userId: number;
    body: string;
    postId: number;
}

export interface CommentInterface extends PostInterface {
    postId: number;
    name: string;
    email: string;
}

export interface UsersInterface extends CommentInterface {
    username: string;
}
