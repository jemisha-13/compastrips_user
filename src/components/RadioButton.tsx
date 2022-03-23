import React from 'react';

interface Props {
    onSelect?: () => void;
    type: string;
    name: string;
    id: string;
    value: string;
    BtnLable: string;
}


const RadioButton: React.FC<Props> = ({
    type,
    BtnLable,
    name,
    id,
    value,
    onSelect }) => {
    return (
        <div className="checkboxes checkbox-add_top_15 mr-2">
            <label className="container_check-detail">
                <input
                    type={type}
                    name={name}
                    id={id}
                    onChange={onSelect}
                    value={value} />
                {BtnLable && <span className="checkmark">{BtnLable}</span>}
            </label>
        </div>
    )
}

export default RadioButton;