import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import WebIcon from '@mui/icons-material/Web';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';

type Props = {
    isAuth: boolean
    setIsAuth: (isAuth: boolean) => void;
}

function NavigationBar({ isAuth, setIsAuth }: Props) {
    let navigate = useNavigate();

    const signUserOut = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            setIsAuth(false);
            navigate("/login");
        })
    }

    return (
        <div className="container-fluid bg-dark mb-5">
            <Navbar expand="lg" className="py-3">
                <Container>
                    <Navbar.Brand href="/" className="d-flex justify-content-center align-items-center link-body-emphasis text-decoration-none">
                        <WebIcon style={{ color: 'white' }} />
                        <div className='text-white ms-1'>Posts</div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" style={{backgroundColor: 'white'}}/>
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Link as={Link} to="/" className="nav-link link-secondary">Home</Nav.Link>
                            <Nav.Link as={Link} to="/createpost" className="nav-link link-primary">Create Post</Nav.Link>
                        </Nav>
                        <div className="d-flex">
                            {!isAuth
                                ? <Nav.Link as={Link} to="/login" className="nav-link link-primary me-2">Log in</Nav.Link>
                                : <Nav.Link  onClick={signUserOut} className="nav-link link-primary me-2">Log out</Nav.Link>
                            }
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavigationBar;
