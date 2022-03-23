import React from 'react'


interface Props {
    type: string;
    label: string;
    name: string;
    id: string;
    value: string;
    styleCheck: string;
    checked?: boolean,
    onChange: (e: object) => void;
}



const CheckBox: React.FC<Props> = ({ type, label, name, id, value, styleCheck, onChange, checked }) => {
    const handleChange = (event: { target: { value: any; }; }) => {
        // const { value } = event.target;
        // setError(validateInput(validators, value));
        onChange(event);
    }

    return (
        <>
            <label className="container_check">{label}
                <input
                    type={type}
                    name={name}
                    id={id}
                    checked={checked}
                    value={value}
                    onChange={handleChange}
                />
                <span className={styleCheck}></span>
            </label>

        </>
    )
};

export default CheckBox
