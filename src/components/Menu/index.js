import React from 'react';

// Import Material UI
import {
  Button,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Gesture as GestureIcon,
  Inbox as InboxIcon,
  Add as CreateIcon,
  Layers as LayersIcon,
  Create as EditIcon,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';

// Import Component
import CreateMenu from './Create';
import EditMenu from './Edit';

// Import container
// import LayerPaper from '../../containers/LayerPaper';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(5),
    margin: '-0.5em',
  },
  layerPaper: {
    paddingLeft: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
  list: {
    minWidth: theme.spacing(10),
    maxWidth: 178
  }
}));

const MenuFeatures = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const classes = useStyles();

  const buttonsFeature = [
    {
      type: (
        <ListItem button className={classes.nested}>
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary={<CreateMenu />} />
        </ListItem>
      ),
      name: 'Create',
    },
    {
      type: (
        <ListItem button className={classes.nested}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={<EditMenu />} />
        </ListItem>
      ),
      name: 'Edit',
    },
  ];

  const actions = [
    {
      title: <LayersIcon color="primary" />,
      name: 'Open Layers',
      content: (
        <div className={classes.layerPaper}>
          {/* <LayerPaper /> */}
        </div>
      ),
    },
    {
      title: <GestureIcon color="primary" />,
      name: 'Features',
      content: buttonsFeature.map((button) => button.type),
    },
  ];

  return (
    <>
      <List className={classes.list}>
        {actions.map((action) => (action.name === 'Features' ? (
          <>
            <ListItem button onClick={handleClick}>
              <ListItemIcon>{action.title}</ListItemIcon>
              <ListItemText primary={action.name} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {action.content}
              </List>
            </Collapse>
          </>
        ) : (
          <>
            <ListItem>
              <ListItemIcon>{action.title}</ListItemIcon>
              <ListItemText primary={action.name} />
            </ListItem>
            {action.content}
          </>
        )))}
      </List>
    </>
  );
};

export default MenuFeatures;
