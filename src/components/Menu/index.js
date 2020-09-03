import React, { Fragment } from 'react';

// Import Material UI
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
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
import LayerPaper from '../../containers/LayerPaper';

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
    // minWidth: theme.spacing(10),
    // maxWidth: 178,
  },
}));

const MenuFeatures = ({layers, drawerState}) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const classes = useStyles();

  const buttonsFeature = [
    {
      type: <CreateMenu classes={classes.nested} key="CreateMenu" />,
      name: 'Create',
    },
    {
      type: <EditMenu classes={classes.nested} key="EditMenu" />,
      name: 'Edit',
    },
  ];

  const actions = [
    {
      title: (
        <Badge
          color="secondary"
          overlap="circle"
          badgeContent={layers.length}
          variant="dot"
        >
          <LayersIcon color="primary" fontSize="large" />
        </Badge>),
      name: 'Open Layers',
      content: <div className={classes.layerPaper}><LayerPaper /></div>,
    },
    {
      title: <GestureIcon fontSize="large" color="primary" />,
      name: 'Features',
      content: buttonsFeature.map((button) => button.type),
    },
  ];

  return (
    <>
      <List className={classes.list}>
        {actions.map((action) => (action.name === 'Features' ? (
          <Fragment key={action.name}>
            <ListItem
              button
              onClick={() => {
                handleClick();
              }}
            >
              <ListItemIcon>{action.title}</ListItemIcon>
              <ListItemText primary={action.name} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {action.content}
              </List>
            </Collapse>
          </Fragment>
        ) : (
          <Fragment key={action.name}>
            <ListItem button>
              <ListItemIcon>{action.title}</ListItemIcon>
              <ListItemText primary={action.name} />
            </ListItem>
            {drawerState ? action.content : ''}
          </Fragment>
        )))}
      </List>
    </>
  );
};

export default MenuFeatures;
