interface Category {
    id?: number,
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
    id?: number,
    title: string,
    description: string,
    category: Category,
    path: string,
    exifs: Exifs,
    originalPath?: string,
    download?: boolean,
}

interface User {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    admin: boolean,
    password?: string,
}

interface DateObject {
    timestamp: number,
    offset: number,
}

interface Post {
    id?: number,
    title: string,
    published: boolean,
    content: string,
    author: string,
    category: Category,
    createdAt: DateObject,
    updatedContent: DateObject,
    locale: string,
    description?: string,
    cover?: string,
}

type Item = Category | Photo | User | Post