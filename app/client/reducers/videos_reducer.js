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
			return[...action.payload.videos];
		case ADD_SERIES:
			console.log("REDUCER",state,action.payload);
			let newSeries=action.payload
			let newStateAdd=state;
			newSeries.forEach(serie => {
				serie.id=newStateAdd.length+1;
				newStateAdd.push(serie);
			});
			console.log(newStateAdd);
			return [...newStateAdd];
		case REMOVE_SERIE:
			let newState=state;
			state.forEach((serie,index) =>{
				if(serie.id==action.payload.id){
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
