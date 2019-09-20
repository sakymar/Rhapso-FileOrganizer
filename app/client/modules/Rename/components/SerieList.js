import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import styled from "styled-components";
const SerieListContainer = styled.div`
  display: flex;
  .MuiListItemText-primary {
    color: black !important;
  }
`;

function SerieList({ series, onRemoveElement, onDrop }) {
  return (
    <SerieListContainer style={{ display: "flex" }}>
      <List
        style={{
          backgroundColor: "white",
          width: "45%",
          marginLeft: "5%",
          borderRadius: "2px",
          paddingBottom: "0px",
          marginBottom: "0px"
        }}
      >
        {series.map(serie => {
          if (!serie.renamed) {
            return (
              <ListItem
                key={serie.id}
                style={{
                  borderBottom: "1px solid black"
                }}
              >
                <ListItemText
                  style={{ color: "black" }}
                  primary={serie.name}
                  secondary={serie.path}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => onRemoveElement(serie)}
                    aria-label="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          }
        })}
        <ListItem style={{ padding: 0 }}>
          {/* <Dropzone
            onDrop={onDrop}
            multiple
            activeStyle={{
              backgroundColor: "red",
              border: "5px solid red"
            }}
            rejectClassName="dropzone-reject"
            style={{
              width: "100%",
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <AddIcon style={{ color: "red" }} />
          </Dropzone> */}
        </ListItem>
      </List>
      <List
        style={{
          backgroundColor: "white",
          width: "40%",
          marginLeft: "5%",
          borderRadius: "2px"
        }}
      >
        {series.map(serie => {
          return (
            <ListItem
              key={serie.id}
              style={{
                borderBottom: "1px solid black",
                backgroundColor: serie.renamed ? "green" : "white"
              }}
            >
              <ListItemText
                primary={serie.outputName}
                secondary={serie.outputPath}
              />
            </ListItem>
          );
        })}
      </List>
    </SerieListContainer>
  );
}

export default SerieList;
