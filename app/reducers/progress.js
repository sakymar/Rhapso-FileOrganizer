import _ from "lodash";
import {
	PROGRESS,RESET_PROGRESS
} from "../actions/types";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case PROGRESS:
			return action.payload*100;
		case RESET_PROGRESS:
            return 0;
		default:
			return state;
	}
};
