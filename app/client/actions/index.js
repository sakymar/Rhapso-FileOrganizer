import { createList } from "../modules/Create/actions";

const actions = {
  Create: {
    List: data => {
      console.log("ALORS OUI EN FAIT JE PASSE EN EFFET", data);
      createList(data);
    }
  }
};

export default actions;
