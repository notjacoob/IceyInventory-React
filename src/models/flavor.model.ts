import { Batch } from "./batch.model";
import { Category } from "./category.model";

export interface Flavor {
    id: number,
    name: string,
    costPerBatch: number,
    making: boolean,
    inUse: boolean,
    category_id: Category
    batches: Batch[]
}