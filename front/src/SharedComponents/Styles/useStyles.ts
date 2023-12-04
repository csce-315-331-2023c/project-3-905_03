const useStyles = () => ({
    textFieldCustom: {
        width: '40%',
        marginBottom: '15px',
        '& .MuiInputBase-root': {
            height: '45px',
            alignItems: 'center',
            backgroundColor: 'var(--input-background)',
        },
        '& .MuiInputBase-input': {
            padding: '0.8em 1.2em',
            fontFamily: 'motor, monospace',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '1.1rem',
            color: '#ffffff',
            borderRadius: 'var(--border-radius)',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'var(--background-color)',
                transition: 'border-color 0.3s',
            },
            '&:hover fieldset': {
                borderColor: 'var(--mess-color)',
            },
            '&.Mui-focused fieldset': {
                borderWidth: '1px',
                borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '1px',
                borderColor: 'var(--mess-color)',
            },
        },
        '& .MuiIconButton-root': {
            color: 'var(--input-text-color)',
        },
    },
    iconButton: {
        backgroundColor: 'none',
        border: 'none',
        color: '#ffffff',
        width: '2.5rem',
        height: '2.5rem',
        padding: '10px',
        transition: 'all 0.3s ease',
        '& .MuiIconButton-root': {
            fontSize: '1.5rem',
        },
        '& svg': {
            width: '100%',
            height: '100%',
        },
        '&:hover': {
            color: 'var(--icon-hover-color)',
        },
        '&:active': {

            transform: 'scale(0.95)',
        },
    },
    
});

export default useStyles;