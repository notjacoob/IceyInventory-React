import { Axios } from "axios";
import { Category } from "../models/category.model";
import { UpdateStatus } from "../models/putStatus.model";

export default class CategoriesService {

    constructor(private client: Axios) {}

    public getCategories(callback: (categories: Category[]) => void): void {
        this.client.get<Category[]>("/v1/categories").then(res => callback(res.data))
    }
    public deleteCategory(id: number, callback: (status: UpdateStatus) => void): void {
        this.client.delete<UpdateStatus>("/v1/categories", {data: {id: id}}).then(res => callback(res.data))
    }
    public updateCategory(category: Category, callback: (status: UpdateStatus) => void): void {
        this.client.put<UpdateStatus>("/v1/categories", category).then(res => callback(res.data))
    }
    public postCategory(name: string, callback: (status: UpdateStatus) => void): void {
        this.client.post<UpdateStatus>("/v1/categories", {name: name}).then(res => callback(res.data))
    }
    public getCategoryId(id: number, callback: (category: Category) => void): void {
        this.client.get<Category>("/v1/categories/id/"+id).then(res => callback(res.data))
    }

}