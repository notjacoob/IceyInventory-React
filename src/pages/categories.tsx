import { FormEvent, useEffect, useState } from "react"
import CategoriesService from "../service/CategoriesService"
import Navbar from "./components/navbar"
import { Category } from "../models/category.model"

const CategoriesComponent = (props: { categoriesService: CategoriesService }): JSX.Element => {

    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        props.categoriesService.getCategories(cat => {
            setCategories(cat)
        })
    })

    const [newCatName, setNewCatName] = useState<string | undefined>(undefined)
    const [editObj, setEditObj] = useState<{newName: string|undefined, toEdit: boolean, whichEdit: number}>({newName: undefined, toEdit: false, whichEdit: -1})
    const [newCat, setNewCat] = useState<boolean>(false)

    const del = (id: number) => {
        if (window.confirm("Are you sure you want to delete this category? All associated flavors will also be deleted.")) {
            props.categoriesService.deleteCategory(id, status => {
                if (status.affectedRows > 0) {
                    setCategories(categories.filter(c => c.id !== id))
                } else {
                    alert("Delete was not succesful")
                }
            })
        }
    }
    const edit = (c: Category) => {
        if (editObj.toEdit && c.id !== editObj.whichEdit) {
            setEditObj({
                toEdit: editObj.toEdit,
                whichEdit: c.id,
                newName: c.name
            })
        } else if (editObj.toEdit && c.id === editObj.whichEdit) {
            setEditObj({
                toEdit: !editObj.toEdit,
                whichEdit: editObj.whichEdit,
                newName: editObj.newName
            })
        } else {
            setEditObj({
                toEdit: !editObj.toEdit,
                whichEdit: c.id,
                newName: c.name
            })
        }
    }
    const confirmEdit = (event: FormEvent<HTMLFormElement>, cat: Category) => {
        event.preventDefault()
        if (editObj.newName != undefined && editObj.newName != '' && editObj.newName != cat.name) {
            cat.name = editObj.newName
            props.categoriesService.updateCategory(cat, (status) => {
                if (status.affectedRows > 0) {
                    setCategories(categories.map(c => c.id === cat.id ? cat : c))
                    setEditObj({
                        toEdit: !editObj.toEdit,
                        whichEdit: editObj.whichEdit,
                        newName: editObj.newName
                    })
                } else {
                    alert("Could not edit!")
                }
            })
        } else {
            alert("The new name must be different from " + cat.name)
        }
    }
    const newCategory = () => {
        setNewCat(true)
    }
    const leftButton = (c: Category) => {
        if (!editObj.toEdit || editObj.whichEdit !== c.id) {
            return (
                <a style={{color: "red"}} className="btn btn-link link-btn" onClick={() => del(c.id)}>Delete</a>
            )
        } else if (editObj.toEdit && editObj.whichEdit === c.id) {
            return (
                <a style={{color: "red"}} className="btn btn-link link-btn" onClick={() => edit(c)}>Cancel</a>
            )
        }
    }
    const rightButton = (c: Category) => {
        if (!editObj.toEdit || editObj.whichEdit !== c.id) {
            return (
                <a style={{color: "green"}} className="btn btn-link link-btn" onClick={() => edit(c)}>Edit</a>
            )
        } else if (editObj.toEdit && editObj.whichEdit === c.id) {
            return (
                <button type="submit" style={{color: "green"}} className="btn btn-link link-btn" form={"editCat-" + c.id}>Submit</button>
            )
        }
    }
    const confirmNewCat = () => {
        if (newCatName != undefined && newCatName != '') {
            props.categoriesService.postCategory(newCatName, status => {
                if (status.affectedRows > 0) {
                    props.categoriesService.getCategoryId(status.insertId, cat => {
                        setCategories([...categories, cat])
                        cancelNewCat()
                    })
                }
            })
        } else {
            alert("Please enter a name!")
        }
    }
    const cancelNewCat = () => {
        setNewCat(false)
        setNewCatName(undefined)
    }
    const formatCategories = (): JSX.Element[] => {
        return categories.map(c => (
            <li className="list-group-item d-flex flex-row justify-content-evenly align-items-center">
                {leftButton(c)}
                {
                    (!editObj.toEdit || editObj.whichEdit !== c.id) && <span>{c.name}</span>
                }
                {
                    (editObj.toEdit && editObj.whichEdit === c.id) && 
                    <form className="d-flex flex-row gap-1" id={"editCat-" + c.id} onSubmit={(event) => confirmEdit(event, c)}>
                        <input type="text" name="name" defaultValue={editObj.newName} onChange={(event) => {
                            setEditObj({
                                toEdit: editObj.toEdit,
                                whichEdit: editObj.whichEdit,
                                newName: event.target.value
                            })
                        }}/>
                    </form>
                }
                {rightButton(c)}
            </li>
        ))
    }
    return (
        <>
            <Navbar currentPage="categories" />
            <div className="w-100 h-100 d-flex align-items-center justify-content-center flex-column">
                <h1>Categories</h1>
                <ul className="list-group mt-3 w-75 text-center">
                    {
                        categories.length === 0 && <li className="list-group-item">No categories!</li>
                    }
                    {formatCategories()}
                    <li className="list-group-item d-flex flex-row justify-content-evenly">
                        {!newCat && <a className="link-btn" onClick={() => newCategory()}>Create new category...</a>}
                        {
                            newCat && <>
                                <a style={{ color: 'red' }} className="link-btn" onClick={() => cancelNewCat()}>Cancel</a>
                                <input type="text" placeholder="Enter name..." defaultValue={newCatName} onChange={(event) => setNewCatName(event.target.value)} />
                                <a style={{ color: 'green' }} className="link-btn" onClick={() => confirmNewCat()}>Submit</a>
                            </>
                        }
                    </li>
                </ul>
            </div>
        </>
    )
}
export default CategoriesComponent