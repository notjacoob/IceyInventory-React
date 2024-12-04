import { Link } from "react-router-dom";
import "../css/navbar.scss"

const Navbar = (props: {currentPage: string}) => {
    const formatCurrentPage = (): string => {
        return formatPage(props.currentPage)
    }
    const formatPage = (page: string): string => {
        let a = page.replace("-", ' ').split(' ')
        let b: string[] = []
        a.forEach(aa => {
            b.push(capitalizeFirstLetter(aa))
        })
        return b.join(' ')
    }
    const generateLink = (to: string, page: string) => {
        if (props.currentPage === page) {
            return (
                <li className="nav-item">
                    <Link className={"nav-link nav-link-disabled"} to={to} onClick={voidOnClick}>{formatPage(page)} <span className="sr-only">(current)</span></Link>
                </li>
            )
        } else {
            return (
                <li className="nav-item">
                    <Link className="nav-link" to={to}>{formatPage(page)}</Link>
                </li>
            )
        }

    }
    const voidOnClick = (event: { preventDefault: () => void; }): void => {
        event.preventDefault()
    }
    const capitalizeFirstLetter = (str: string): string => {
        return String(str).charAt(0).toUpperCase() + String(str).slice(1)
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">
                <img src="/icecube.png" width="30" height="30" className="d-inline-block align-top"/>
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav mr-auto">
                    {generateLink("/", "home")}
                    {generateLink("/flavor-management", "flavor-management")}
                    {generateLink("/categories", "categories")}
                </ul>
                <span className="navbar-text position-absolute end-0">
                    {formatCurrentPage()}
                </span>
            </div>
        </nav>
    )
}
export default Navbar