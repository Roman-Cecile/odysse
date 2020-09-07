import React, { Fragment, useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Edit as EditIcon } from '@material-ui/icons';
import { Fab, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  field: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    margin: 'auto',
  },
  fab: {
    position: 'fixed',
    right: 10,
    bottom: 20,
  },
}));
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

const Window = ({ handleOneFeatureProperties, properties, handleChange }) => {
  const classes = useStyles();
  const data = localStorage.getItem('properties');
  const json = JSON.parse(data);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    handleOneFeatureProperties(json);
  }, []);
  function selectType(type) {
    if (Number(type)) {
      return 'number';
    }
    const checkType = typeof type;
    if (checkType === 'string') {
      return 'text';
    }
    return 'undefined';
  }

  const handleChangeInput = (event) => {
    if (edit) {
      handleChange(event.target.name, event.target.value);
    }
  };

  return (
    <>
      <form className={classes.field}>
        {keyProperties.map((key) => (
          <Fragment key={key}>
            <TextField
              margin="normal"
              name={key}
              label={key}
              onChange={(event) => handleChangeInput(event)}
              value={properties[key] || ''}
              type={selectType(properties[key])}
            />
          </Fragment>
        ))}
        {/* <button type="button" onClick={() => setEdit(true)}>Modifier</button> */}
      </form>
      <Tooltip title="Modifier" aria-label="edit" placement="left">
        <Fab className={classes.fab} onClick={() => setEdit(true)} color="secondary" aria-label="edit">
          <EditIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default Window;
