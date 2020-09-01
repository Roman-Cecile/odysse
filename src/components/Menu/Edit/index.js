import React from 'react';
import { Button } from '@material-ui/core';

const Edit = () => {
  const [isActive, setIsActive] = React.useState(true);
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 27) {
      setIsActive(false);
    }
  });
  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={() => {
          window.postMessage(['edit']);
        }}
        disabled={isActive}
      >
        Editer
      </Button>
    </>
  );
};

export default Edit;
