import { Link , useNavigate} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';

function Navbar() {
    const navigate = useNavigate();

    const navigateHome = () => {
      navigate('/home');
    };

    const navBarStyle ={
        border: "1px solid #ccc",
        backgroundColor: "#edf3fa",
        height: "40px"
    }

    const home = {
        display: "inline-block",
        padding: "10px",
        color: "black"
    }

    const logout = {
        position:"absolute",
        display: "inline-block",
        right: 20,
        top: 10,
    }

    const welcome = {
        display: "inline-block",
        position:"absolute",
        top : -5,
        right : 100
    }

    return (
        <div style={navBarStyle}>
            <div style={home}>
                {/* <Button variant="text" onClick={navigateHome}><HomeIcon /></Button> */}
                <Link to ="/home"><HomeIcon /></Link>
            </div>
            
            <div style={welcome}>  
                <p><strong>Welcome Back</strong></p>
            </div>

            <div style={logout}>
                <Link to ="/" ><LogoutIcon /></Link>
            </div>

        </div>
    )
}

export default Navbar;