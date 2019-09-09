import React, { Component } from "react";
import styled from "styled-components";
import { FormControlLabel, Radio, Button, RadioGroup } from "@material-ui/core";
import { I18n, setLocale } from "react-redux-i18n";
import storage from "electron-settings";
import get from "lodash/get";
import { shell } from "electron";

const SettingsContainer = styled.div``;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Label = styled.p`
  font-size: 12px;
`;

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { theme: "dark", lang: "fr" };
  }

  async componentDidMount() {
    const data = storage.getAll();
    this.setState({ lang: get(data, "lang"), theme: get(data, "theme") });
  }

  handleChange(field, event) {
    this.setState({ [field]: event.target.value });
    storage.set(field, event.target.value);
  }

  render() {
    const { theme, lang } = this.state;
    return (
      <SettingsContainer className="containerScreen">
        <Row>
          <Label>{I18n.t("settings.openSettingsFileLabel")}</Label>
          <Button onClick={() => shell.showItemInFolder(storage.file())}>
            {I18n.t("settings.openSettingsFileButton")}
          </Button>
        </Row>
        <Row>
          <Label>{I18n.t("settings.themeLabel")}</Label>

          <RadioGroup
            aria-label="dark"
            name="theme"
            value={theme}
            onChange={event => this.handleChange("theme", event)}
          >
            <Row>
              <FormControlLabel
                value="dark"
                control={<Radio />}
                label={I18n.t("settings.themeDark")}
              />
              <FormControlLabel
                value="light"
                control={<Radio />}
                label={I18n.t("settings.themeLight")}
              />
            </Row>
          </RadioGroup>
        </Row>
        <Row>
          <Label>{I18n.t("settings.languageLabel")}</Label>
          <RadioGroup
            aria-label="lang"
            name="lang"
            value={lang}
            onChange={event => {
              this.handleChange("lang", event);
              setLocale(event.target.value);
            }}
          >
            <Row>
              <FormControlLabel
                value="fr"
                control={<Radio />}
                label="Français"
              />
              <FormControlLabel
                value="en"
                control={<Radio />}
                label="English"
              />
            </Row>
          </RadioGroup>
        </Row>
      </SettingsContainer>
    );
  }
}

export default Settings;
