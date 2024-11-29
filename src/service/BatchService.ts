import { Axios } from "axios";
import { Batch } from "../models/batch.model";
import { UpdateStatus } from "../models/putStatus.model";

export default class BatchService {
    
    constructor(private client: Axios) {}

    public postBatch(b: Batch, callback: (rowUpdated: UpdateStatus) => void): void {
        this.client.post<UpdateStatus>("/v1/batches", {
            flavorId: b.id,
            dateMade: b.dateMade.toString(),
            type: b.type
        }).then(res => callback(res.data))
    }

}