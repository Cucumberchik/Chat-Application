import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App"
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
)
