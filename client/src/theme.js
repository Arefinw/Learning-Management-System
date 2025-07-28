/**
 * @fileoverview This file defines the Material-UI theme for the application.
 * @description It serves as the single source of truth for design tokens, including palette, typography, and shape.
 */

import { createTheme } from '@mui/material/styles';

/**
 * @description Creates a custom Material-UI theme with specified palette, typography, and shape.
 * @returns {object} The Material-UI theme object.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A professional blue
    },
    background: {
      default: '#f4f6f8', // Light grey background
      paper: '#ffffff', // White for cards and paper
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Modern sans-serif font
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    // Add more typography variants as needed
  },
  shape: {
    borderRadius: 8, // Subtle border radius for components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply border radius to buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply border radius to cards
        },
      },
    },
  },
});

export default theme;
