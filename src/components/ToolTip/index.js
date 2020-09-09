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
  console.log(someProps);
  return (
    <ul>
      <li>{someProps.STATUT}</li>
    </ul>
  );
};

export default ToolTip;
