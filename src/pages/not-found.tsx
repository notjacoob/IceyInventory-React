import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="align-items-center text-center justify-content-center h-100 w-100 d-flex flex-column gap-3">
            <h1>404 :(</h1>
            <h2>Could not find "{window.location.pathname}"</h2>
            <Link className="btn btn-primary" to="/">Go Home</Link>
        </div>
    )
}
export default NotFound