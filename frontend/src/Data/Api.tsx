import axios, { AxiosError, HttpStatusCode } from "axios";
import { Book, CreateBookType, UpdateBookType } from "../types/book.type";
import { LoginType, RegisterType, TokenPayloadType, UpdateUserType } from "../types/auth.type";
import { UpdateUserForm, User } from "../types/user.type";
import { RatingType } from "../types/rating.type";

const API_BASE_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export async function fetchUpdateUserInfor(
    { birthDate, email, name, phoneNumber }: UpdateUserForm,
    token: string
): Promise<void> {
    const data: any = {};

    if (email) data.email = email;

    if (name) data.name = name;

    if (phoneNumber) data.phoneNumber = phoneNumber;

    if (birthDate) data.birthDate = birthDate;
    console.log(data);

    return api.patch("user", data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export async function viewBook(fileName: string, token: string) {
    return api.get(`book/view/${fileName}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function getAllRatingOfBook(bookId: number | string): Promise<RatingType[]> {
    const response = await api.get("rating", { params: { bookId: bookId } });
    return response.data.data.ratings;
}

export async function fetchGetABook(bookId: string | number): Promise<Book> {
    const response = await api.get(`book/${bookId}`);
    return response.data.data;
}

export async function fetchGetBooks(endpoint: string): Promise<Book[] | null> {
    const response = await api.get(endpoint);
    if (response.status !== HttpStatusCode.Ok || typeof response.data === "undefined") {
        return null;
    }
    return response.data.data.books;
}

export async function fetchChangePassword(oldPassword: string, newPassword: string, token: string): Promise<void> {
    console.log({ oldPassword, newPassword });

    return api.patch(
        "user/change-password",
        { oldPassword, newPassword },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export async function fetchUpdateBook(data: UpdateBookType, token: string, id: string | number): Promise<void> {
    const formData = new FormData();

    if (data.author) formData.append("author", data.author);
    if (data.title) formData.append("title", data.title);
    if (data.genre) formData.append("genre", data.genre);
    if (data.description) formData.append("description", data.description);
    if (data.stock) formData.append("stock", data.stock.toString());
    if (data.publishedDate) formData.append("publishedDate", String(data.publishedDate));
    if (data.version) formData.append("version", data.version.toString());

    if (data.ebookFile && data.ebookFile[0]) {
        formData.append("ebookFile", data.ebookFile[0]);
    }

    if (data.coverImageFile && data.coverImageFile[0]) {
        formData.append("coverImageFile", data.coverImageFile[0]);
    }
    console.log({ data });
    try {
        const response = await api.patch(`book/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}
export async function fetchUpdateUser(data: UpdateUserType, token: string): Promise<void> {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);
    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    if (data.birthDate) formData.append("publishedDate", String(data.birthDate));

    console.log({ data });
    try {
        const response = await api.patch(`user`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const searchBooks = async (endpoint: string, params: Record<string, string>): Promise<Book[] | null> => {
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
    );
    const response = await api.get(endpoint, {
        params: filteredParams
    });

    if (response.status !== HttpStatusCode.Ok || !response.data) return null;
    return response.data.data.books;
};

export async function fetchCreateBook(endPoint: string, data: CreateBookType, token: string) {
    const formData = new FormData();

    formData.append("author", data.author);
    formData.append("title", data.title);
    formData.append("format", data.format);

    if (data.genre) formData.append("genre", data.genre);
    if (data.description) formData.append("description", data.description);
    if (data.stock) formData.append("stock", data.stock.toString());
    if (data.publishedDate) formData.append("publishedDate", String(data.publishedDate));
    if (data.version) formData.append("version", data.version.toString());

    if (data.ebookFile && data.ebookFile[0]) {
        formData.append("ebookFile", data.ebookFile[0]);
    }

    if (data.coverImageFile && data.coverImageFile[0]) {
        formData.append("coverImageFile", data.coverImageFile[0]);
    }
    const response = await api.post(endPoint, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });
    if (response.status !== HttpStatusCode.Created || typeof response.data === "undefined") {
        return null;
    }

    return response.data.data;
}

export async function fetchDeleteBook(bookId: string | number, token: string): Promise<boolean> {
    const response = await api.delete(`book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status !== HttpStatusCode.Ok) {
        return false;
    }
    return true;
}

export async function fetchDeleteUser(bookId: string | number, token: string): Promise<boolean> {
    const response = await api.delete(`user/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status !== HttpStatusCode.Ok) {
        return false;
    }
    return true;
}

export async function getUserProfile(token: string): Promise<User> {
    const repsonse = await api.get("user/profile/", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (repsonse.status !== HttpStatusCode.Ok) throw new AxiosError("Token không hợp lệ!");

    return repsonse.data.data;
}

export async function fetchGetUsers(endpoint: string, token: string): Promise<User[]> {
    const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.data.users;
}

export const getUser = async (endpoint: string, token: string) => {
    try {
        const response = await api.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi API:", error.response?.status, error.response?.data?.message);
            return {
                statusCode: error.response?.status || 500,
                status: "error",
                message: error.response?.data?.message || "Lỗi không xác định"
            };
        }
        return { statusCode: 500, status: "error", message: "Lỗi không xác định" };
    }
};

export const getAll = async (endpoint: string) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi API:", error.response?.status, error.response?.data?.message);
            return {
                statusCode: error.response?.status || 500,
                status: "error",
                message: error.response?.data?.message || "Lỗi không xác định"
            };
        }
        return { statusCode: 500, status: "error", message: "Lỗi không xác định" };
    }
};

export const createUser = async (endpoint: string) => {
    try {
        const data = {
            title: "Hello Axios",
            body: "Đây là nội dung bài viết",
            userId: 1
        };
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi API:", error.response?.status, error.response?.data?.message);
            return {
                statusCode: error.response?.status || 500,
                status: "error",
                message: error.response?.data?.message || "Lỗi không xác định"
            };
        }
        return { statusCode: 500, status: "error", message: "Lỗi không xác định" };
    }
};

export async function getTokenPayload(token: string): Promise<TokenPayloadType> {
    const reponse = await api.get("auth/token-payload", {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (reponse.status !== HttpStatusCode.Ok) throw new AxiosError("Token không hợp lệ, vui lòng đăng nhập lại");
    return reponse.data.data;
}

export const LoginNormal = async (
    endpoint: string,
    data: LoginType
): Promise<{ token: string; exprires_in: string } | undefined> => {
    const response = await api.post(endpoint, data);

    if (!response.data || !response.data.data || !response.data.data.token) throw new Error("Lỗi");

    return {
        token: response.data.data.token,
        exprires_in: response.data.data.expries_in
    };
};

export async function fetchRegisterUser(endpoint: string, data: RegisterType) {
    const response = await api.post(endpoint, data);
    if (response.status !== HttpStatusCode.Created) throw new AxiosError("Đăng kí thất bại!");
    return response.data;
}

export const deleteById = async (endpoint: string, id: string | number) => {
    try {
        const response = await api.delete(`${endpoint}/${id}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi API:", error.response?.status, error.response?.data?.message);
            return {
                statusCode: error.response?.status || 500,
                status: "error",
                message: error.response?.data?.message || "Lỗi không xác định"
            };
        }
        return { statusCode: 500, status: "error", message: "Lỗi không xác định" };
    }
};

export const getById = async (endpoint: string, id: string | number) => {
    try {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi API:", error.response?.status, error.response?.data?.message);
            return {
                statusCode: error.response?.status || 500,
                status: "error",
                message: error.response?.data?.message || "Lỗi không xác định"
            };
        }
        return { statusCode: 500, status: "error", message: "Lỗi không xác định" };
    }
};


