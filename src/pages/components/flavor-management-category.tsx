import { Accordion } from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { ReactNode, useState } from "react";
import { Category } from "../../models/category.model";
import { ExpandMore } from "@mui/icons-material";
import { Flavor } from "../../models/flavor.model";
import FlavorComponent from "./flavor";
import FlavorsService from "../../service/FlavorsService";
import BatchService from "../../service/BatchService";

const FlavorManagementCategory = (props: {flavorService: FlavorsService, batchService: BatchService, category: Category, flavors: Flavor[], onFlavorDelete: (id: number) => void, openCategories: number[], flipOpenCategory: (id: number) => void}) => {

    const buildId = (append: string): string => {
        return "panel-" + props.category.id + "-" + append
    }
    const renderFlavors = (): ReactNode[] => {
        return props.flavors.map(f => (
            <FlavorComponent key={f.id} flavorService={props.flavorService} batchService={props.batchService} flavor={f} onDelete={props.onFlavorDelete} />
        ))
    }
    return (
        <Accordion expanded={props.openCategories.includes(props.category.id)} onChange={() => props.flipOpenCategory(props.category.id)}>
            <AccordionSummary expandIcon={<ExpandMore/>} aria-controls={buildId("content")} id={buildId("header")}>
                {props.category.name}
            </AccordionSummary>
            <AccordionDetails>
                <>
                    <div className="text-center d-flex flex-column gap-3">
                        {renderFlavors()}
                    </div>
                </>
            </AccordionDetails>
        </Accordion>
    )
}
export default FlavorManagementCategory