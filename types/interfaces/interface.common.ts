import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    email?: string;
}

export interface Article {
    id: string;
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
    bookmarkCount: number;
}

export interface Country {
    name: {
        common: string;
    };
}

export interface User {
    username: string;
    email: string;
    password: string;
}
