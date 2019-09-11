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
  Switch
} from "@material-ui/core";
import Button from "../../../components/Button";
import readdirp from "readdirp";
import { remote } from "electron";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteFiles } from "../helpers";

const ExtensionContainer = styled.div`
  .listContainer {
    overflow-y: auto;
    width: 80%;
    max-height: 50vh;
  }
`;

class Extension extends Component {
  constructor(props) {
    super(props);
    this.state = { allFiles: [], selectedFiles: [], checkedExtensions: {} };
  }

  handleChangeCheckbox = (name, event) => {
    const { allFiles } = this.state;
    const checkedExtensions = event.target.checked
      ? [...this.state.checkedExtensions, name]
      : this.state.checkedExtensions.filter(item => item !== name);

    this.setState({
      checkedExtensions,
      selectedFiles: allFiles.filter(item =>
        checkedExtensions.includes(item.extension)
      )
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
      allData = [
        ...allData,
        ...entries.map(item => ({
          ...item,
          extension: item.basename.split(".").pop()
        }))
      ];
    }
    this.setState({
      allFiles: allData,
      selectedFiles: allData,
      checkedExtensions: [...new Set(allData.map(item => item.extension))]
    });
  }

  render() {
    const {
      allFiles,
      selectedFiles,
      checkedExtensions,
      recursive
    } = this.state;
    const extensions = [...new Set(allFiles.map(item => item.extension))];

    return (
      <ExtensionContainer>
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
        {extensions &&
          extensions.length > 0 &&
          extensions.map(item => (
            <FormControlLabel
              label={item}
              control={
                <Checkbox
                  checked={checkedExtensions.includes(item)}
                  onChange={event => this.handleChangeCheckbox(item, event)}
                  value={item}
                  inputProps={{
                    "aria-label": "primary checkbox"
                  }}
                />
              }
            />
          ))}
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
                  <ListItemSecondaryAction>
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
                  </ListItemSecondaryAction>
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
                checkedExtensions: {}
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
                checkedExtensions: []
              });
            }}
          >
            Confirm
          </Button>
        </React.Fragment>
      </ExtensionContainer>
    );
  }
}

export default Extension;
