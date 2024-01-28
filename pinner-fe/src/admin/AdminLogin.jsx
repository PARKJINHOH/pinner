import * as React from 'react';
import {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";

// component
import {errorAlert} from "components/alert/AlertComponent";
import {useAPIv1} from "apis/apiv1";
import {useDoLogin} from "states/admin";

import {clearAdmin} from "states/adminWebstore";

// mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useAuth} from "./provider/AuthProvider";

export default function AdminLogin() {

    const {setToken} = useAuth();
    const apiv1 = useAPIv1();
    const doLogin = useDoLogin();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleSubmit(e) {
        const isEnter = e.key === "Enter";
        const isMouseClick = e.type === "click";

        if (isEnter || isMouseClick) {
            e.preventDefault();
            clearAdmin();
            if (email.length === 0 || password.length === 0) {
                setErrorMessage('이메일, 비밀번호를 확인해주세요.');
            } else {
                setErrorMessage('');
            }

            apiv1.post("/admin/login", JSON.stringify({email: email.trim(), password: password.trim()}))
                .then((response) => {
                    doLogin({
                        email: response.data.email,
                        adminName: response.data.adminName,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    });
                    setToken(response.data.accessToken);

                    // 페이지 이동
                    navigate("/admin/dashboard", { replace: true });
                })
                .catch((error) => {
                    setErrorMessage(error.message);
                });
        }


    }

    return (
        <Box justifyContent="center" alignItems="center" sx={{display: 'flex', width: 'auto', height: '100vh', bgcolor: '#EEF2F6'}}>
            <Container component="main" maxWidth="xs" sx={{bgcolor: '#ffffff', borderRadius: '15px'}}>
                <Box
                    sx={{
                        display: 'flex',
                        marginTop: '50px',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Admin
                    </Typography>
                    <Box noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email} onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password} onChange={(e) => setPassword(e.currentTarget.value)}
                            onKeyDown={handleSubmit}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            onClick={handleSubmit}
                        >
                            Sign In
                        </Button>
                        {
                            errorMessage && errorAlert(errorMessage)
                        }
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            {/*<Grid item>*/}
                            {/*    <Link href="#" variant="body2">*/}
                            {/*        {"Don't have an account? Sign Up"}*/}
                            {/*    </Link>*/}
                            {/*</Grid>*/}
                        </Grid>
                    </Box>
                </Box>
                <Box sx={{mt: 8, mb: 4}}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <Link color="inherit" href="https://pinner.dev">
                            https://pinner.dev
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
