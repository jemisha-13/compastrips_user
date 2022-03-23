import { useState } from 'react'

const ReadMore = ({ children }: any, fontStyle: string) => {
    const text = children;
    const more = (text.length > 120) ? true : false
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className={fontStyle}>
            {isReadMore ? text.slice(0, 120) : text}{(more && isReadMore) ? "... " : ""}
            <u>
                <span onClick={toggleReadMore} className="font-16-bold color-dark cursor-p">
                    {more && (isReadMore ? "Show All" : " Show Less")}
                </span>
            </u>
        </p>
    );
};

export default ReadMore;