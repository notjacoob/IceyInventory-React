import { Axios } from "axios"
import { Flavor } from "../models/flavor.model"
import { UpdateStatus } from "../models/putStatus.model"
class FlavorsService {

    constructor(private client: Axios) {}

    public getFlavors(callback: (flavors: Flavor[]) => void): void {
        this.client.get<Flavor[]>("/v1/flavors").then((res) => {
            callback(res.data)
        })
    }
    public updateFlavor(flavor: Flavor, callback: (rowUpdated: UpdateStatus) => void): void {
        this.client.put<UpdateStatus>("/v1/flavors", {
            id: flavor.id,
            name: flavor.name,
            costPerBatch: flavor.costPerBatch,
            making: flavor.making === true ? 1 : 0,
            inUse: flavor.inUse === true ? 1 : 0
        }).then(res => {
            callback(res.data)
        })
    }
    public deleteFlavor(flavorId: number, callback: (rowUpdated: UpdateStatus) => void): void {
        this.client.delete<UpdateStatus>("/v1/flavors/deleteAssoc", {
            data: {
                id: flavorId
            }
        }).then(res => callback(res.data))
    }
    public addFlavor(flavor: Flavor, callback: (rowUpdated: UpdateStatus) => void): void {
        this.client.post<UpdateStatus>("/v1/flavors", {
            name: flavor.name,
            costPerBatch: flavor.costPerBatch,
            making: flavor.making,
            inUse: flavor.inUse,
            category_id: flavor.category_id.id
        }).then(res => callback(res.data))
    }
}
export default FlavorsService