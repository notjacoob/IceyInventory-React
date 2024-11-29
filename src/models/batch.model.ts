export enum Type {
    Full, Half
}
export interface Batch {
    id: number,
    dateMade: String,
    type: Type|String,
}