import { Batch } from "../../models/batch.model";
import { BatchCreationWrapper } from "../../models/batchCreationWrapper.model";
import { BatchWrapper } from "../../models/batchWrapper.model";
import { Flavor } from "../../models/flavor.model";
import BatchService from "../../service/BatchService";
import FlavorsService from "../../service/FlavorsService";
import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import "../css/flavor.scss"

const FlavorComponent = (props: { flavorService: FlavorsService, batchService: BatchService, onDelete: (id: number) => void, flavor: Flavor }) => {

    const formatBatches = (): BatchWrapper[] => {
        let fixedBatches: BatchWrapper[] = []
        let ids: String[] = []
        for (let b of props.flavor.batches) {
            let identifier = `${b.dateMade}${b.type}`
            if (ids.includes(identifier)) {
                let idx = ids.indexOf(identifier)
                if (fixedBatches[idx]) {
                    fixedBatches[idx].count++
                }
            } else {
                ids.push(identifier)
                fixedBatches.push({
                    batch: b,
                    count: 1
                })
            }
        }
        return fixedBatches
    }
    const formatBatchesReact = () => {
        let batches = formatBatches()
        return batches.map(b => (
            <tr key={b.batch.id}>
                <td>{parseDate(b.batch)}</td>
                <td>{b.batch.type}</td>
                <td>{b.count}</td>
            </tr>
        ))
    }


    const newBatch: BatchCreationWrapper = {
        type: "None",
        count: undefined,
        dateMade: undefined,
        flavor: props.flavor.id
    }

    const [, forceUpdate] = useReducer(x => x + 1, 0)
    let firstRun = useRef(true)

    const batches: BatchWrapper[] = formatBatches()
    const [error, setError] = useState("")
    const [edit, setEdit] = useState<boolean>(false)
    const [newName, setNewName] = useState<string | undefined>(props.flavor.name)
    const [toggleState, setToggleState] = useState<{making: boolean, inUse: boolean}>({making: props.flavor.making, inUse: props.flavor.inUse})
    const [newCostPerBatch, setNewCostPerBatch] = useState<number | undefined>(props.flavor.costPerBatch)

    useEffect(() => {
        if (toggleState.inUse != props.flavor.inUse || toggleState.making != props.flavor.making) {
            props.flavor.making = toggleState.making
            props.flavor.inUse = toggleState.inUse
            props.flavorService.updateFlavor(props.flavor, (data) => {
                if (data.changedRows < 1) {
                    alert("Update was not successful")
                }
            })
        }
    }, [toggleState])
    useEffect(() => {
        if (error != "") {
            alert(error)
        }
    }, [error])

    const createNewBatch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (newBatch.count != null && newBatch.count > -1) {
            if (newBatch.dateMade != null) {
                if (newBatch.type === "Full" || newBatch.type === "Half") {
                    for (let i = 0; i < newBatch.count; i++) {
                        props.batchService.postBatch({
                            id: props.flavor.id,
                            type: newBatch.type,
                            dateMade: String(newBatch.dateMade)
                        }, (data) => {
                            if (data.affectedRows < 1) {
                                alert("Could not insert batch!")
                            } else {
                                let d: Date = new Date(newBatch.dateMade!!)
                                d.setDate(d.getDate() + 1)
                                props.flavor.batches.push({
                                    id: data.insertId,
                                    type: newBatch.type,
                                    dateMade: String(d)
                                })
                                forceUpdate()
                            }
                        })
                    }
                } else {
                    setError("type must be either 'Full' or 'Half'")
                }
            } else {
                setError("Please select a date")
            }
        } else {
            setError("Count must be greater than 0")
        }
    }

    const changeState = (event: React.ChangeEvent<HTMLInputElement>, func: (val: any) => void): void => {
        func(event.currentTarget.value)
    }

    const parseDate = (b:Batch): string => {
        let date: Date = new Date(b.dateMade as string)
        return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
    }

    const toggleEdit = () => {
        setEdit(!edit)
    }
    const submitEdit = () => {
        props.flavor.costPerBatch = newCostPerBatch!!
        props.flavor.name = newName!!
        props.flavorService.updateFlavor(props.flavor, (status) => {
            if (status.affectedRows > 0) {
                toggleEdit()
            }
        })
    }
    
    const sendDelete = () => {
        if (window.confirm("Are you sure you want to delete this flavor?")) {
            props.flavorService.deleteFlavor(props.flavor.id, (data) => {
                if (data.affectedRows > 0) {
                    props.onDelete(props.flavor.id)
                } else {
                    alert("Could not delete flavor!")
                }
            })
        }
    }


    return (
        <div className="flavor-parent d-flex flex-column">
            <div className="d-flex flex-column flex-lg-row flavor-header">
                <div className="d-flex flex-row gap-3 text-center flavor-header-child">
                    {edit ? <>
                        <h5><input className="flavor-edit-field" type="text" onChange={(data) => changeState(data, setNewName)} defaultValue={newName}></input></h5>
                        <h5>Cost/batch: <input type="number" className="flavor-edit-field" onChange={(data) => changeState(data, setNewCostPerBatch)} value={newCostPerBatch}></input></h5>
                        <a className="link-btn" onClick={() => submitEdit()}>Submit</a>
                    </> : <>
                        <h5>{props.flavor.name}</h5>
                        <h5>Cost/batch: ${props.flavor.costPerBatch}</h5>
                    </>}
                    <a className="link-btn" onClick={() => toggleEdit()}>Edit</a>
                </div>
                <div className="d-flex flex-row gap-5 flavor-header-child">
                    <a onClick={() => sendDelete()} className="flavor-delete">Delete</a>
                    <div className="form-switch form-check">
                        <label htmlFor={"making-" + props.flavor.id} className="form-check-label">Making</label>
                        <input type="checkbox" role="switch" id={"making-" + props.flavor.id} name="making" className="form-check-input" onChange={() => setToggleState({ inUse: toggleState.inUse, making: !toggleState.making })} defaultChecked={props.flavor.making}></input>
                    </div>
                    <div className="form-switch form-check">
                        <label htmlFor={"inUse-" + props.flavor.id} className="form-check-label">In Use</label>
                        <input type="checkbox" role="switch" id={"inUse-" + props.flavor.id} name="inUse" className="form-check-input" onChange={() => setToggleState({inUse: !toggleState.inUse, making: toggleState.making})} defaultChecked={props.flavor.inUse}></input>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-row">
                <table className="table table-striped flavor-inventory-display">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Size</th>
                            <th scope="col">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            batches.length === 0 ? <tr>
                                <td>No data!</td>
                                <td>No data!</td>
                                <td>No data!</td>
                            </tr> : formatBatchesReact()
                        }
                    </tbody>
                </table>
                <form className="d-flex flex-column flavor-inventory-control gap-1 p-2" name="newBatch" onSubmit={(event) => createNewBatch(event)}>
                    <h4>Inventory Control</h4>
                    <input type="number" id="count" name="count" placeholder="Enter count" defaultValue={newBatch.count} onChange={(event) => newBatch.count = Number.parseInt(event.target.value)}/>
                    <label htmlFor="datemade">Select date...</label>
                    <input type="date" id="datemade" name="datemade" defaultValue={newBatch.dateMade?.toISOString().split('T')[0]} onChange={(event) => newBatch.dateMade = new Date(event.target.value)}/>

                    <div>
                        <label htmlFor="full">Full Batch</label>
                        <input type="radio" id="full" name="type" value="Full" onChange={(event) => newBatch.type = event.target.value}/>
                    </div>
                    <div>
                        <label htmlFor="half">Half Batch</label>
                        <input type="radio" id="half" name="type" value="Half" onChange={(event) => newBatch.type = event.target.value}/>
                    </div>
                    <input type="hidden" name="flavor" value={props.flavor.id} onChange={(event) => newBatch.flavor = parseInt(event.target.value)}/>
                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            </div>
        </div>
    )
}
export default FlavorComponent