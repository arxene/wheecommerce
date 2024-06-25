import {FaStar, FaStarHalfAlt, FaRegStar} from "react-icons/fa";

const StarRating = ({rating, text}) => {
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                // full star
                stars.push(<FaStar key={i} />);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                // half star
                stars.push(<FaStarHalfAlt key={i} />);
            } else {
                // empty star
                stars.push(<FaRegStar key={i} />);
            }
        }
        return stars;
    };

    return (
        <div className="rating">
            {renderStars()}
            <span className="rating-text">{text}</span>
        </div>
    );
};

export default StarRating;
