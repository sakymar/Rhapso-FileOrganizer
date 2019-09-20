import { createList } from "../modules/Create/actions";
import storage from "electron-settings";

const actions = {
  Notification: id => {
    new Notification("Rhapso - Create List", {
      body: "Hey confirm the action"
    });

    const rules = storage.get("rules");
    const rule = Object.values(rules).find(item => item.id === id);

    rule.waitingForConfirm = true;
    storage.set("rules", { ...rules, [rule.id]: rule });
  },
  Create: {
    List: data => {
      console.log("Passage dans l'action", data);
      createList(data);
    }
  }
};

export default actions;
