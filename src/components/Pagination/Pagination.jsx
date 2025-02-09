import {
  faAnglesLeft,
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function PaginationComponent({
  totalPages,
  currentPage,
  handlePagination,
}) {
  return (
    <>
      {totalPages.length > 1 ? (
        <Pagination>
          <PaginationItem>
            <PaginationLink onClick={() => handlePagination(1)}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() =>
                handlePagination(currentPage > 1 ? currentPage - 1 : 1)
              }
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </PaginationLink>
          </PaginationItem>
          {totalPages.length > 0
            ? totalPages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePagination(page)}
                    className={page === currentPage ? "active" : ""}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))
            : null}
          <PaginationItem>
            <PaginationLink
              onClick={() =>
                handlePagination(
                  currentPage === totalPages.length
                    ? totalPages.length
                    : currentPage + 1
                )
              }
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => handlePagination(totalPages.length)}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      ) : (
        <Pagination>
          <PaginationItem>
            <PaginationLink className="active">1</PaginationLink>
          </PaginationItem>
        </Pagination>
      )}
    </>
  );
}
