import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from '@fortawesome/free-solid-svg-icons'
import Rating from 'react-rating'
import ReadMore from '../../components/ReadMore'
import { useTranslation } from 'react-i18next'
function Reviews(props: any) {

    const { t } = useTranslation();

    const changeDateType = (date: string) => {
        const x = new Date(date);
        const y = x.getMonth();
        const z = x.getFullYear().toString();
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return month[y - 1] + " " + z
    }

    const Review = (rating: number) => {
        if (rating >= 0 && rating <= 1) {
            return `${t("Wasn't_Good")}`;
        }
        else if (rating > 1 && rating <= 2) {
            return `${t("Disappointed")}`;
        }
        else if (rating > 2 && rating <= 3) {
            return `${t("Decent")}`;
        }
        else if (rating > 3 && rating <= 4) {
            return `${t("Satisfied")}`;
        }
        else {
            return `${t("Very_Satisfied")}`;
        }
    }



    return (
        <div>
            {props.reviews && <div>

                <div className="mt-80">
                    <h4 className="font-30-bold">{t('Itinerary_Desc.Reviews')} <span className="no-of-reviews">{props.reviews.recentReview && props.reviews.recentReview.length}</span></h4>
                    <div className="d-flex mt-30 h-59 align-items-center mb-45">
                        <h3 className="font-43-bold color-dark">{props.reviews.star !== "NaN" ? props.reviews.star : ""}</h3>
                        <div className="tour-created ml-2">
                            <div className="d-flex mt-1 ml-17">
                                <div className="star-list-revie">
                                    <Rating
                                        emptySymbol={<img src="./img/blankstar.svg" className="mr-1" alt=""/>}
                                        fullSymbol={<img src="./img/star.svg" className="mr-1" alt=""/>}
                                        initialRating={props.reviews.star}
                                        readonly={true}
                                        stop={5}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {props.reviews.recentReview && props.reviews.recentReview.map((review: any) =>
                            <div className="review-card">
                                <div className="user-details-wrapper">
                                    {review.user.avatar ? <img src={review.user.avatar} alt="avatar" /> : <img src="/img/Avatar.png" alt="avatar" />}
                                    <div className="user-details">
                                        <strong className="font-20-bold color-dark h-30">{review.user.user_name}</strong>
                                        <p className="font-14-normal">{changeDateType(review.updated_at)}</p>
                                    </div>
                                </div>
                                <div className="review-card-middle">
                                    <FontAwesomeIcon icon={faStar} className="fill-star" /> <strong className="font-16-bold">{review.star} {Review(review.star)}</strong>
                                </div>
                                <div>
                                    {/* <p className="font-16-normal color-darkgray">{review.content}</p> */}
                                    <ReadMore className="font-16-normal color-darkgray">
                                        {review.content}
                                    </ReadMore>
                                </div>
                            </div>)}
                    </div>
                </div>

            </div>}
        </div>
    )
}

export default Reviews
