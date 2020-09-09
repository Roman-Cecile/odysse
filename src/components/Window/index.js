/* eslint-disable no-console */
import React, { Fragment, useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Edit as EditIcon, Save as SaveIcon } from '@material-ui/icons';
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
  fabSave: {
    position: 'fixed',
    right: 10,
    bottom: 90,
  },
}));

const keyProperties = [];

const Window = ({ handleOneFeatureProperties, properties, handleChange }) => {
  const classes = useStyles();
  const data = localStorage.getItem('properties');
  const json = JSON.parse(data);
  // eslint-disable-next-line no-restricted-syntax
  for (const key in properties) {
    if (key !== 'geometry' && !keyProperties.includes(key) ) {
      keyProperties.push(key);
    }
  }
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
  
  const [edit, setEdit] = useState(false);
  const handleChangeInput = (event) => {
    if (edit) {
      handleChange(event);
    }
  };
  return (
    <>
      <form className={classes.field}>
        {keyProperties.map((key) => (
          <Fragment key={key}>
            <TextField
              margin="normal"
              disabled={!edit}
              name={key}
              label={key}
              onChange={(event) => handleChangeInput(event)}
              value={properties[key] || ''}
              type={selectType(properties[key])}
            />
          </Fragment>
        ))}
        {edit
        && (
        <Tooltip title="Sauvegarder" aria-label="save" placement="left">
          <Fab className={classes.fabSave} onClick={() => setEdit(false)} color="primary">
            <SaveIcon />
          </Fab>
        </Tooltip>
        )}
      </form>
      <Tooltip title="Modifier" aria-label="edit" placement="left">
        <Fab
          disabled={edit}
          className={classes.fab}
          onClick={(event) => {
            event.preventDefault()
            setEdit(true)
          }}
          color="secondary"
          aria-label="edit">
          <EditIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default Window;
