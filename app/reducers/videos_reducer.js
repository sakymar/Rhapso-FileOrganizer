import _ from "lodash";
import {
	ADD_SERIE,
	ADD_SERIES,
	REMOVE_SERIE,
	REMOVE_ALL_SERIES,
	SERIE_RENAMED
} from "../actions/types";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SERIE_RENAMED:
			return { ...state, [action.payload.path]: action.payload };
		case ADD_SERIES:
			return { ...state, ..._.mapKeys(action.payload, "path") };
		case ADD_SERIE:
			return [...state,action.payload];
		case REMOVE_SERIE:
			let newState=state;
			state.forEach((serie,index) =>{
				console.log(serie.name);
				console.log(action.payload.name);
				if(serie.name==action.payload.name){
					state.splice(index,1);
				}
			})
			return state;
		case REMOVE_ALL_SERIES:
			return INITIAL_STATE;
		default:
			return state;
	}
};
