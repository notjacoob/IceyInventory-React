import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import { Category } from "../../models/category.model"
import { ExpandMore } from "@mui/icons-material"

const NoFlavors = (props: {category: Category}) => {
    const buildId = (append: string): string => {
        return "panel-" + props.category.id + "-" + append
    }
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore/>} aria-controls={buildId("content")} id={buildId("header")}>
                {props.category.name}
            </AccordionSummary>
            <AccordionDetails className="text-center">
                <h2 className="mt-3">No Flavors!</h2>
            </AccordionDetails>
        </Accordion>
    )
}
export default NoFlavors