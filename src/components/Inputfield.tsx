import React from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    name: string;
    value: string;
    // validators: string;
    lablestyleClass: string;
    InputstyleClass: string;
    onChange: (e: object) => void;
    label: string;
    placeholder: string;
    type: string;
    fromrowStyleclass: string;
    disabled?: boolean,
    maxLength?: number;
}

const InputField: React.FC<Props> = ({ name, maxLength, value, lablestyleClass, InputstyleClass, onChange, disabled, label, placeholder, type, fromrowStyleclass }) => {


    const handleChange = (event: { target: { value: any; }; }) => {
        // const { value } = event.target;
        // setError(validateInput(validators, value));
        onChange(event);
    }

    return (
        <Form.Group className={`mb-0 ${fromrowStyleclass}`}>
            {label && <Form.Label className={lablestyleClass}>{label}</Form.Label>}

            {type === 'textarea' ? (
                <Form.Control
                    as="textarea"
                    rows={5}
                    name={name}
                    className={InputstyleClass}
                    placeholder={placeholder}
                    onChange={handleChange}
                    value={value}
                    disabled={disabled}
                    autoComplete="off"
                    maxLength={maxLength}
                />
            ) : (
                <Form.Control
                    name={name}
                    value={value}
                    className={InputstyleClass}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    autoComplete="off"
                    disabled={disabled}
                    maxLength={maxLength}
                />
            )}


        </Form.Group>
    )
};


export default InputField;
