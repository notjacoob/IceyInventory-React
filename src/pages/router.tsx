import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import FlavorManagement from "./flavor-management";
import NotFound from "./not-found";
import FlavorsService from "../service/FlavorsService";
import axios from "axios";
import BatchService from "../service/BatchService";
import NewFlavor from "./new-flavor";
import CategoriesService from "../service/CategoriesService";
import CategoriesComponent from "./categories";

const Router: React.FC = () => {

    const axiosClient = axios.create({
        baseURL: "http://localhost:5002/"
    })

    const flavorService = new FlavorsService(axiosClient)
    const batchService = new BatchService(axiosClient)
    const categoriesService = new CategoriesService(axiosClient)

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="" element={<Home />} />
                    <Route path="flavor-management" element={<FlavorManagement flavorService={flavorService} batchService={batchService} categoryService={categoriesService}/>}/>
                    <Route path="flavor-management/new-flavor" element={<NewFlavor categoriesService={categoriesService} flavorsService={flavorService}/>}/>
                    <Route path="/categories" element={<CategoriesComponent categoriesService={categoriesService}/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}
export default Router
