import React from "react";
import { Link } from "react-router-dom";
import "./css/home.scss"
import Navbar from "./components/navbar";

const Home: React.FC = () => {
    return (
        <>
            <Navbar currentPage="home"></Navbar>
            <div className="d-flex w-100 h-100 align-items-center justify-content-center">
                <div className="d-flex flex-column vw-50 vh-75 align-items-center gap-3">
                    <img src="/icey-inventory.png" />
                    <Link className="button-80 w-100" role="button" to="/flavor-management">Flavor Management</Link>
                    <Link className="button-80 w-100" role="button" to="/categories">Categories</Link>
                </div>
            </div>
        </>

    )
}
export default Home