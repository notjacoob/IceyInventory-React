import { useState, useEffect } from "react";
import { Flavor } from "../models/flavor.model";
import FlavorsService from "../service/FlavorsService";
import { Category } from "../models/category.model";
import { Link } from "react-router-dom";
import FlavorManagementCategory from "./components/flavor-management-category";
import Navbar from "./components/navbar";
import BatchService from "../service/BatchService";
import CategoriesService from "../service/CategoriesService";
import NoFlavors from "./components/no-flavors";
import { IServiceProvider, useService } from "./components/services";

const FlavorManagement = () => {

    const services: IServiceProvider = useService()
    const [openCategories, setOpenCategories] = useState<number[]>([])
    let [flavors, setFlavors] = useState<Flavor[]>([])
    let [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        services.flavorService().getFlavors((f) => {
            setFlavors(f)
        })
        services.categoriesService().getCategories(cat => {
            setCategories(cat)
        })
    }, [])

    const handleDeletion = (flavorId: number): void => {
        setFlavors(flavors.filter(f => f.id !== flavorId))
    }
    const flipOpenCategory = (cid: number) => {
        if (openCategories.includes(cid))
            setOpenCategories(openCategories.filter(i => i !== cid))
        else 
            setOpenCategories([...openCategories, cid])
    }
    const fixCategories = () => {
        return categories.map(c => {
            if (flavors.filter(f => f.category_id.id === c.id).length > 0) {
                return <FlavorManagementCategory category={c} key={c.id} flavors={flavorsForCat(c)} onFlavorDelete={handleDeletion} openCategories={openCategories} flipOpenCategory={flipOpenCategory}/>
            } else {
                return <NoFlavors category={c}/>
            }
        })
    }
    const flavorsForCat = (c: Category): Flavor[] => {
        return flavors.filter(f => f.category_id.name === c.name)
    }

    return (
        <>
            <Navbar currentPage="flavor-management"/>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center flex-column">
                <Link className="w-75 mt-3" to="/flavor-management/new-flavor">
                    <button className="w-100 submit-btn">New Flavor</button>
                </Link>
                {
                    flavors.length === 0 && <h2 className="mt-3">No flavors!</h2>
                }
                <div className="mt-3 col-12 col-xl-9">
                    {fixCategories()}
                </div>
            </div>
        </>

    )
}
export default FlavorManagement