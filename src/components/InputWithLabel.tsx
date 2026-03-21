import Input from "./Input";

type InputWithLabelProps = {
    required?: boolean;
    readOnly?: boolean;
    type?: string,
    label: string;
    defaultValue?: string | number;
    name: string;
    placeholder: string;
    classBox?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

};

const InputWithLabel = ({
    required = false,
    readOnly = false,
    type = "text",
    label,
    defaultValue = "",
    name,
    placeholder,
    classBox = "",
    onChange,
    value
}: InputWithLabelProps) => {
    return (
        <div className={`space-y-1 ${classBox}`}>
            <label className="text-xs font-bold uppercase text-gray-500" >
                {label}
            </label>
            {onChange !== undefined ?
                <Input
                    type={type}
                    name={name}
                    value={value}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    required={required}
                    onChange={onChange}
                /> :
                <Input
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    required={required}
                    onChange={onChange}
                />
            }

        </div>
    );
};

export default InputWithLabel;