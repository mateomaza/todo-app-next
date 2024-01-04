import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
          © 2024 TaskTracker
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;