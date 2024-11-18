import React from 'react'
import WebIcon from '@mui/icons-material/Web';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import { Link } from 'react-router-dom';


export default function Footer() {
    return (
        <div className="container-fluid">
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div className="col-md-4 d-flex align-items-center">
                    <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                        <WebIcon style={{ color: 'black' }} />
                    </a>
                    <span className="mb-3 mb-md-0 text-body-secondary">© {new Date().getFullYear()} Posts, Inc</span>
                </div>

                <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <li className="ms-3"><Link to="" className="text-body-secondary" ><InstagramIcon /></Link></li>
                    <li className="ms-3"><Link to="" className="text-body-secondary" ><TwitterIcon /></Link></li>
                    <li className="ms-3"><Link to="" className="text-body-secondary" ><TelegramIcon /></Link></li>
                </ul>
            </footer>
        </div>
    )
}