interface IInputProps {
	type: string;
	text: string;
	name: string;
	placeholder: string;
	handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	value: string;
	multiple: boolean;
}

function Input({
	type,
	text,
	name,
	placeholder,
	handleOnChange,
	value,
	multiple,
}: IInputProps) {
	return (
		<div className="flex flex-col mt-4 drop-shadow-md">
			<label htmlFor={name}>{text}</label>
			<input
				className="mt-2 p-3 rounded"
				type={type}
				name={name}
				id={name}
				placeholder={placeholder}
				onChange={handleOnChange}
				defaultValue={value}
				{...(multiple ? { multiple } : "")}
			/>
		</div>
	);
}

export { Input };
