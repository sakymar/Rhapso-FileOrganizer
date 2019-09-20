import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import storage from "electron-settings";
import uuidv4 from "uuid/v4";
import styled from "styled-components";

const SaveButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
`;

const handleAddRule = data => {
  let rules = storage.get("rules");
  if (!rules) {
    rules = [];
  }
  const newId = uuidv4();
  storage.set("rules", { ...rules, [newId]: { ...data, id: newId } });
};

const SaveButton = ({ data }) => (
  <SaveButtonContainer>
    <Fab onClick={() => handleAddRule(data)} color="primary" aria-label="add">
      <AddIcon />
    </Fab>
  </SaveButtonContainer>
);

export default SaveButton;
