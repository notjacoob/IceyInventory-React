import { createContext, useContext, useRef } from "react";
import FlavorsService from "../../service/FlavorsService";
import BatchService from "../../service/BatchService";
import CategoriesService from "../../service/CategoriesService";
import axios from "axios";

export interface IServiceProvider {
    flavorService: (() => FlavorsService)
    batchService: (() => BatchService)
    categoriesService: (() => CategoriesService)
}

const serviceContext = createContext<IServiceProvider|undefined>(undefined)

export function useService(): IServiceProvider {
    return useContext(serviceContext)!!
}

export function ServiceProvider({children}: any) {
    const axiosClient = useRef(axios.create({
        baseURL: "http://localhost:5002/"
    }))

    const flavorServiceRef = useRef(new FlavorsService(axiosClient.current))
    const batchServiceRef = useRef(new BatchService(axiosClient.current))
    const categoriesServiceRef = useRef(new CategoriesService(axiosClient.current))

    const categoriesService = (): CategoriesService => {
        return categoriesServiceRef.current
    }
    const flavorService = (): FlavorsService => {
        return flavorServiceRef.current
    }
    const batchService = (): BatchService => {
        return batchServiceRef.current
    }
    return (
        <serviceContext.Provider value={{categoriesService, flavorService, batchService}}>
            {children}
        </serviceContext.Provider>
    )
}