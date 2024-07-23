import {Pagination} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

const Paginate = ({numPages, currentPage, isAdmin = false}) => {
    return (
        numPages > 1 && (
            <Pagination>
                {[...Array(numPages).keys()].map((x) => (
                    <LinkContainer key={x + 1} to={!isAdmin ? `/page/${x + 1}` : `/admin/productlist/${x + 1}`}>
                        <Pagination.Item active={x + 1 === currentPage}>{x + 1}</Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
    );
};

export default Paginate;
