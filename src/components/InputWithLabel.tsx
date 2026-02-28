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

};

const InputWithLabel = ({
    required = false,
    readOnly = false,
    type = "text",
    label,
    defaultValue = "",
    name,
    placeholder,
    classBox = ""
}: InputWithLabelProps) => {
    return (
        <div className={`space-y-1 ${classBox}`}>
            <label className="text-xs font-bold uppercase text-gray-500" >
                {label}
            </label>
            <Input
                type={type}
                name={name}
                defaultValue={defaultValue}
                readOnly={readOnly}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
};

export default InputWithLabel;