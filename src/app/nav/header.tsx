import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import Button from '@mui/material/Button';

const Header = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaskTracker
          </Typography>
          <nav>
            <Link href="/" passHref>
              <Button color="inherit">Home</Button>
            </Link>
          </nav>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
