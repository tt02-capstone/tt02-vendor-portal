import Navbar from "../components/Navbar"
import { Button } from '@mui/material';
import {useNavigate} from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const navigateCreateAdmin= () => {
      navigate('/createAdmin');
    };

    return (
        <div>
            <Navbar />
            <br></br>
            <Button fullWidth variant="contained" onClick={navigateCreateAdmin}>
                Add Admin
            </Button>
        </div>
    )
}