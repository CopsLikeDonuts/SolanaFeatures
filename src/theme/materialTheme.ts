import { createTheme } from '@mui/material'

const palette = {
  white: '#FFFFFF',
  greySecondary: '#BCC2D8',
  softWhite: 'rgba(255, 255, 255, 0.1)',
  softWhiteHover: 'rgba(255, 255, 255, 0.04)',
  softBackgroundDark: 'rgba(255, 255, 255, 0.15)',
  softBackgroundDarker: 'rgba(255, 255, 255, 0.3)',
  softBackgroundDarkest: 'rgba(255, 255, 255, 0.4)',
  softBackgroundMiddleDark: 'rgba(255, 255, 255, 0.25)',
  darkBlue: '#18186A',
  primaryBlack: '#0C131E',
  greySoft: 'rgba(188, 194, 216, 0.5)',
  blackSoft: 'rgba(12, 19, 30, 0.4)',
}

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  spacing: 4,
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: 'break-word',
        },
        h1: {
          fontSize: '60px',
          fontWeight: 600,
          lineHeight: '100%',
          '@media (max-width:1024px)': {
            fontSize: '56px',
          },
          '@media (max-width:600px)': {
            fontSize: '48px',
          },
        },
        h2: {
          fontSize: '40px',
          fontWeight: 700,
          lineHeight: '100%',
          '@media (max-width:1024px)': {
            fontSize: '36px',
          },
          '@media (max-width:600px)': {
            fontSize: '32px',
          },
        },
        h3: {
          fontSize: '32px',
          fontWeight: 600,
          lineHeight: '100%',
          '@media (max-width:600px)': {
            fontSize: '20px',
          },
        },
        // unchangeable
        h4: {
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: '120%',
        },
        h5: {
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '150%',
        },
        h6: {
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '150%',
        },
        subtitle1: {
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '150%',
        },
        subtitle2: {
          fontSize: '12px',
          fontWeight: 500,
          lineHeight: '150%',
        },
        body1: {
          fontSize: '18px',
          fontWeight: 400,
          lineHeight: '150%',
        },
        body2: {
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '150%',
        },
        caption: {
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: '150%',
        },
        button: {
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '150%',
          textTransform: 'unset',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '16px',
          textTransform: 'unset',
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: palette.primaryBlack,
        },
        tooltip: {
          fontSize: '12px',
          background: palette.primaryBlack,
          color: palette.white,
          padding: '12px 16px',
          lineHeight: '150%',
          '@media (max-width:600px)': {
            fontSize: '12px',
            fontWeight: '400',
            lineHeight: '18px',
            marginBottom: '12px!important',
            margin: 16,
            borderRadius: '8px',
          },
        },
        popper: {
          zIndex: 900,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: '40px',
          borderRadius: '12px',
          '@media (max-width:600px)': {
            minWidth: 'unset',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '32px',
          fontWeight: 600,
          lineHeight: '100%',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'inherit',
          display: 'flex',
          textDecoration: 'unset',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(97.62deg, rgba(255, 255, 255, 0.072) 0%, rgba(115, 187, 240, 0.2) 82.77%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          padding: '28px 28px 40px',
        },
        elevation1: {
          boxShadow: 'inset -1px -1px 2px rgba(5, 13, 37, 0.1), inset 1px 1px 1px rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          color: palette.greySecondary,
          maxWidth: '240px',
          '@media (max-width:1024px)': {
            maxWidth: 'unset',
            width: '100%',
          },
        },
        input: {
          padding: '9px 14px',
          color: palette.white,
          '&::placeholder': {
            color: palette.greySecondary,
          },
          width: 'unset',
        },
        notchedOutline: {
          background: palette.softBackgroundDark,
          border: 'unset',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          background: palette.white,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 0,
          '&.Mui-checked': {
            color: palette.darkBlue,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
        },
        colorSecondary: {
          color: palette.greySecondary,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: palette.greySecondary,
          opacity: 0.2,
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.6), transparent)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          minWidth: '124px',
          borderRadius: '12px',
          textTransform: 'unset',
          padding: '10px 20px',
          fontSize: '16px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: palette.white,
          color: palette.darkBlue,
          boxShadow: 'none',
          '&:disabled': {
            backgroundColor: palette.white,
            opacity: 0.4,
            color: palette.darkBlue,
          },
          '&:hover': {
            backgroundColor: palette.white,
            opacity: 0.8,
          },
        },
        outlined: {
          backgroundColor: palette.softWhite,
          color: palette.white,
          border: 'unset',
          '&:hover': {
            backgroundColor: palette.softBackgroundDarker,
            border: 'unset',
          },
          '&:focus': {},
          '&:disabled': {
            backgroundColor: palette.softWhite,
            opacity: 0.4,
          },
        },
      },
    },
  },
  palette: {
    secondary: {
      main: palette.greySecondary,
      dark: palette.blackSoft,
    },
    primary: {
      main: palette.white,
      contrastText: palette.primaryBlack,
      dark: palette.darkBlue,
    },
    background: {
      default: palette.darkBlue,
    },
    info: {
      main: palette.darkBlue,
    },
    grey: {
      50: palette.greySoft,
      100: palette.softBackgroundDark,
      200: palette.softWhite,
      300: palette.softWhiteHover,
      400: palette.softBackgroundDarkest,
      500: palette.softBackgroundMiddleDark,
    },
  },
})

export { theme }
