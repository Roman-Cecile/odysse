import React, { Fragment, useState } from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    width: '100%',
    margin: 'auto',
  },
  tableContainer: {
    // backgroundColor: 'black'
  },
});

const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

const keyProperties = [
  'STATUT',
  'IMPLANT',
  'NATURE_CHA',
  'REF_CHAMBR',
  'REF_NOTE',
  'CODE_COM',
  'CODE_VOIE',
  'NUM_VOIE',
  'ID_PROPRIE',
  'TYPE_TRAPP',
  'QUANTIFICA',
  'ROTATION',
  'CODE_CH1',
  'CODE_CH2',
  'SECURISEE',
  'CLE_MKT1',
  'CODE_CH1_C',
  'CODE_CH2_P',
  'CLASSE',
  'STATUS',
];

const Window = () => {
  const classes = useStyles();
  const data = localStorage.getItem('properties');
  const json = JSON.parse(data);
  const properties = json;
  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table className={classes.table} size="small" aria-label="customized table">
        <TableBody>
          {keyProperties.map((key) => (
            <Fragment key={key.ID_PROPRIE}>
              <StyledTableRow>
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {properties[key]}
                </TableCell>
              </StyledTableRow>
            </Fragment>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Window;

// properties.map((row) => (
//
//       {row[key] !== null
//         ? (
//           <TableRow>
//             <TableCell component="th" scope="row">
//               {key}
//             </TableCell>
// <TableCell style={{ width: 160 }} align="right">
//   {row[key]}
// </TableCell>
//           </TableRow>
//         )
//         : null}
//     </Fragment>
//   ))
