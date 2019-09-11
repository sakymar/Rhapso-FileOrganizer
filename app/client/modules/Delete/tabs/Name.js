import React, { Component } from "react";
import styled from "styled-components";
import {
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  TextField,
  Select,
  MenuItem
} from "@material-ui/core";
import Button from "../../../components/Button";
import readdirp from "readdirp";
import { remote } from "electron";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteFiles } from "../helpers";

const NameContainer = styled.div`
  .listContainer {
    overflow-y: auto;
    width: 80%;
    max-height: 50vh;
  }

  .unitName {
    padding: 15px;
    background-color: grey;
    color: white;
  }

  .unitName:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .activeUnitName {
    background-color: orange;
  }
`;

class NameTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFiles: [],
      selectedFiles: [],
      text: null
    };
  }

  handleChangeCheckbox = (name, event) => {
    const { allFiles } = this.state;
    const checkedNames = event.target.checked
      ? [...this.state.checkedNames, name]
      : this.state.checkedNames.filter(item => item !== name);

    this.setState({
      checkedNames,
      selectedFiles: allFiles.filter(item => checkedNames.includes(item.size))
    });
  };

  handleOpenFolders() {
    const paths = remote.dialog.showOpenDialog({
      properties: ["openDirectory", "multiSelections"]
    });
    this.handlePathFiles(paths);
  }

  async handlePathFiles(paths) {
    let allData = [];
    const { recursive } = this.state;
    for (let pathFolder of paths) {
      const options = {};
      if (!recursive) {
        options.depth = 0;
      }
      const entries = await readdirp.promise(pathFolder, options);
      console.log("ENTRIES", entries);
      allData = [...allData, ...entries];
    }
    this.setState({
      allFiles: allData,
      selectedFiles: allData
    });
  }

  filterFiles() {
    const { text, typeAction, allFiles } = this.state;
    console.log("TYPE ACTION", typeAction);
    console.log("ALL FILES", allFiles);
    if (typeAction === "start") {
      return allFiles.filter(item => String(item.basename).startsWith(text));
    }
    if (typeAction === "after") {
      return allFiles.filter(item => String(item.basename).endsWith(text));
    }
    if (typeAction === "between") {
      return allFiles.filter(item => String(item.basename).includes(text));
    }
  }

  render() {
    const { text, typeAction, recursive } = this.state;

    let selectedFiles = this.filterFiles();
    if (!selectedFiles) {
      selectedFiles = [];
    }

    return (
      <NameContainer>
        <FormControlLabel
          control={
            <Switch
              checked={recursive}
              onChange={event =>
                this.setState({ recursive: event.target.checked })
              }
              value="checkedA"
            />
          }
          label="Recursive"
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Select
            value={typeAction}
            onChange={event =>
              this.setState({ typeAction: event.target.value })
            }
            inputProps={{
              name: "age",
              id: "age-simple"
            }}
          >
            <MenuItem value={"start"}>Starts By</MenuItem>
            <MenuItem value={"end"}>Ends By</MenuItem>
            <MenuItem value="include">Includes</MenuItem>
          </Select>
          <p style={{ marginLeft: "20px", marginRight: "20px" }}> </p>
          <TextField
            id="outlined-number"
            label="Text"
            value={text}
            onChange={event => this.setState({ text: event.target.value })}
            type="text"
            InputLabelProps={{
              shrink: true
            }}
            style={{ color: "white" }}
            margin="normal"
            variant="outlined"
          />
        </div>
        {selectedFiles.length ? (
          <div className="listContainer">
            <List
              style={{
                backgroundColor: "white",
                borderRadius: "2px",
                paddingBottom: "0px",
                marginBottom: "0px"
              }}
            >
              {selectedFiles.map(file => (
                <ListItem
                  key={file.id}
                  style={{
                    borderBottom: "1px solid black"
                  }}
                >
                  <ListItemText
                    style={{ color: "black" }}
                    primary={file.basename}
                    secondary={file.fullPath}
                  />
                  {/* <ListItemSecondaryAction>
                    <IconButton
                      onClick={() =>
                        this.setState({
                          selectedFiles: selectedFiles.filter(
                            item => item.basename != file.basename
                          )
                        })
                      }
                      aria-label="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction> */}
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          <div
            onClick={() => this.handleOpenFolders()}
            onDrop={e => {
              e.preventDefault();
              e.stopPropagation();
              this.handlePathFiles(
                Object.values(e.dataTransfer.files).map(item => item.path)
              );
            }}
            onDragOver={e => {
              e.stopPropagation();
              e.preventDefault();
              console.log("DRAGOVER", e);
            }}
            style={{
              width: "100%",
              height: "20vh",
              border: "5px solid red",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <p>drop folders mate</p>
          </div>
        )}

        <React.Fragment>
          <Button
            onClick={() =>
              this.setState({
                allFiles: [],
                selectedFiles: [],
                checkedNames: {}
              })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteFiles(selectedFiles.map(item => item.fullPath));
              this.setState({
                selectedFiles: [],
                allFiles: [],
                checkedNames: []
              });
            }}
          >
            Confirm
          </Button>
        </React.Fragment>
      </NameContainer>
    );
  }
}

export default NameTab;
