import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    width: '100%',
    margin: 'auto',
  },
  tableContainer: {
    height: 264,
    width: 245,
  },
});

const ToolTip = ({ someProps }) => {
  const classes = useStyles();
  return (
    <p
      className={
        classes.table
        }
    >
      {someProps}
    </p>
  );
};

export default ToolTip;
