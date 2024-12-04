import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import FlavorManagement from "./flavor-management";
import NotFound from "./not-found";
import NewFlavor from "./new-flavor";
import CategoriesComponent from "./categories";
import { ServiceProvider } from "./components/services";

const Router: React.FC = () => {

    return (
        <ServiceProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="" element={<Home />} />
                    <Route path="flavor-management" element={<FlavorManagement/>}/>
                    <Route path="flavor-management/new-flavor" element={<NewFlavor/>}/>
                    <Route path="/categories" element={<CategoriesComponent/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </ServiceProvider>
    )
}
export default Router
