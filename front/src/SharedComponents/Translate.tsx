import React from 'react';
import { useEffect } from 'react';
import {
  Button, Popover
} from '@mui/material';

import TranslateIcon from '@mui/icons-material/Translate';

export const Translate = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handlePopoverClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  useEffect(() => {
    function initializeGoogleTranslate() {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
      } else {
        setTimeout(initializeGoogleTranslate, 500); // Retry initialization after a delay if the Google object is not available
      }
    }
    initializeGoogleTranslate();

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  return (
    <>
      {/* <Button className='profile' onClick={handlePopoverClick} >
        <TranslateIcon className="header-icon"/>
      </Button >
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div id="google_translate_element"></div>

      </Popover> */}
      
      <div id="google_translate_element"></div>
    </>
  );
};
