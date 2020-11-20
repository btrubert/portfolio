interface Category {
    id: number,
    name: string,
    public: boolean,
    user?: User,
    photos: Array<Photo>,
}

interface Exifs {
    shutter: string,
    aperture: string,
    iso: string,
    focal: string,
    brand: string,
    model: string,
    date: string,
}

interface Photo {
    id: number,
    title: string,
    description: string,
    category: Category,
    path: string,
    exifs: Exifs,
}

interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    admin: boolean,
    password: string,
}

type Item = Category | Photo | User