import { FormEvent, useEffect, useState } from "react"
import { Category } from "../models/category.model"
import { Flavor } from "../models/flavor.model"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "./components/navbar"
import { useService } from "./components/services"

const NewFlavor = (): JSX.Element => {
    const services = useService()
    const [categories, setCategories] = useState<Category[]>([])
    const [flavorName, setFlavorName] = useState<string|undefined>(undefined)
    const [categoryId, setCategoryId] = useState<number>(-1)
    const [costPerBatch, setCostPerBatch] = useState<number|undefined>(undefined)
    const navigate = useNavigate()

    const createFlavor = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (flavorName != null && flavorName != "") {
            if (categoryId != null && categoryId > -1) {
                let f: Flavor = {
                    id: -1,
                    name: flavorName,
                    costPerBatch: costPerBatch!!,
                    making: false,
                    inUse: false,
                    category_id: {
                        name: "",
                        id: categoryId
                    },
                    batches: []
                }
                services.flavorService().addFlavor(f, status => {
                    if (status.affectedRows > 0) {
                        navigate("/flavor-management")
                    }
                })
            } else {
                alert("Please select a category")
            }
        } else {
            alert("Please enter a name")
        }
    }
    const mapCategories = (): JSX.Element[] => {
        return categories.map(c => (
            <option value={c.id}>{c.name}</option>
        ))
    }

    useEffect(() => {
        services.categoriesService().getCategories(cat => {
            setCategories(cat)
        })
    }, [])

    return (
        <>
            <Navbar currentPage="new-flavor"/>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center flex-column">
                <Link to="/flavor-management" className="w-75 mt-3"><button className="w-100 submit-btn">Go Back</button></Link>
                <hr/>
                <h2>New Flavor</h2>
                <form className="w-75 mt-3 text-center d-flex flex-column align-items-center gap-3" name="newFlavor" onSubmit={(event) => createFlavor(event)}>
                    <input className="w-75 text-center submit-btn" type="text" name="flavorName" placeholder="Enter name..." defaultValue={flavorName} onChange={(event) => setFlavorName(event.target.value)}/>
                    <input className="w-75 text-center submit-btn" type="number" name="flavorCost" placeholder="Enter cost per batch..." defaultValue={costPerBatch} onChange={(event) => setCostPerBatch(parseInt(event.target.value))}/>
                    <select className="form-select w-75 text-center submit-btn" name="categoryId" defaultValue={categoryId} onChange={(event) => setCategoryId(parseInt(event.target.value))}>
                        <option value="-1" selected>Select category...</option>
                        {mapCategories()}
                    </select>
                    <button type="submit" className="w-75 submit-btn">Submit</button>
                </form>
            </div>
        </>
    )
}
export default NewFlavor