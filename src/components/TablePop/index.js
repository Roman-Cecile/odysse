import React from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Tabl } from '@material-ui/core';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    width: '100%',
    margin: 'auto',
  },
  tableContainer: {
    height: 264,
    width: 245,
  }
});

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

const TablePop = ({ properties }) => {
  const classes = useStyles();
  //   console.log(properties.length && properties[0]);
  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table className={classes.table} size="small" aria-label="customized table">
        <TableBody>
          {keyProperties.map((key) => (

            properties.length && properties.map((row) => (
              <>
                {row[key] !== null
                  ? (
                    <TableRow key={row.ID_PROPRIE}>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="right">
                        {row[key]}
                      </TableCell>
                    </TableRow>
                  )
                  : ''}
              </>
            ))))}

        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablePop;
