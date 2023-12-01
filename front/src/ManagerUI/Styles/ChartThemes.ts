
import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: 'white', // Background color for the DateTimePicker input
                    color: 'black', // Text color
                    // Add more styles as needed
                },
            },
        },
        // Add other component customizations here
    },
    // You can also customize the palette, typography, etc.
});

// Theme for BarChart (assuming @mui/x-charts is compatible with MUI theming)
export const colorSchemes= {
    Category10: [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf',
    ]
};

export { muiTheme };
