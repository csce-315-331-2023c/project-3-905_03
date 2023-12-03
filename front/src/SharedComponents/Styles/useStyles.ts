const useStyles = () => ({

    textFieldCustom: {
        width: '40%',
        marginBottom: '15px',
        '& .MuiInputBase-root': {
            height: '35px',
            alignItems: 'center',
        },
        '& .MuiInputBase-input': {
            padding: '0.6em 1em',
            fontFamily: 'motor, monospace',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '.8rem',
            color: '#ffffff', 
            backgroundColor: 'var(--input-background)',
            borderRadius: 'var(--border-radius)',
        },
        '& .MuiInputBase-adornedEnds': {
            backgroundColor: 'var(--input-background)',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'var(--background-color)',
            },
            '&:hover fieldset': {
                borderColor: 'var(--mess-color)',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'var(--mess-color)',
            },
        },

        '& .MuiIconButton-root': {
            color: 'var(--input-text-color)',
        },
    },
});

export default useStyles;
