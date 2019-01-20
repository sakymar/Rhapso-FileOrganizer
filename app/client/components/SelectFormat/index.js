import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const SelectFormat = ({ value, onChange, options, ...otherProps }) => {
	return (
		<Select
			value={value}
			onChange={event => onChange(event.target.value)}
			{...otherProps}
		>
			{options.map(option => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))}
		</Select>
	);
};

export default SelectFormat;
