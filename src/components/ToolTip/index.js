import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  table: {
    width: '100%',
    margin: 'auto',
  },
  tableContainer: {
    backgroundColor: theme.palette.grey[900],
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    fontFamily: theme.typography.fontFamily,
    padding: '4px 8px',
    width: 100,
    fontSize: theme.typography.pxToRem(10),
    wordWrap: 'break-word',
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

let keyProperties = [];
const ToolTip = ({ someProps, length }) => {
  const classes = useStyles();

  useEffect(() => {
    keyProperties = []; // clean array otherwise length will be too big for the if condition
    // eslint-disable-next-line no-restricted-syntax
    for (const key in someProps) {
      if (key !== 'geometry' && keyProperties.length < 3) {
        keyProperties.push(key);
      }
    }
  }, [someProps])
  return (
    <ul className={classes.tableContainer}>
      {
      keyProperties.map((key) => <Fragment key={key}> <li>{key}: {someProps[key]}</li> </Fragment>)
      }
      <li>{length}</li>
    </ul>
  );
};

export default ToolTip;
