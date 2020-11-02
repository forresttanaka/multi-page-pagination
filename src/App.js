import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import './App.css';
import './pager.scss';


/**
 * Left-pointing chevron to go back one page.
 */
const ChevronLeft = () => (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 265 436.7">
        <path d="M7,201.4L201.4,7c9.4-9.4,24.6-9.4,33.9,0L258,29.7c9.4,9.4,9.4,24.5,0,33.9L104,218.3l154,154.8c9.3,9.4,9.3,24.5,0,33.9 l-22.7,22.7c-9.4,9.4-24.6,9.4-33.9,0L7,235.3C-2.3,225.9-2.3,210.7,7,201.4z" />
    </svg>
);


/**
 * Right-pointing chevron to go forward one page.
 */
const ChevronRight = () => (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 265 436.7">
        <path d="M258,235.3L63.6,429.7c-9.4,9.4-24.6,9.4-33.9,0L7,407c-9.4-9.4-9.4-24.5,0-33.9l154-154.7L7,63.6c-9.3-9.4-9.3-24.5,0-33.9 L29.7,7c9.4-9.4,24.6-9.4,33.9,0L258,201.4C267.4,210.7,267.4,225.9,258,235.3z" />
    </svg>
);


/**
 * Displays a multi-page pager control that lets the user choose a page of data to view.
 */
const Pager = ({ currentPage, total, clickHandler }) => {
    // Create the array of page numbers, with page 0 to represent an ellipsis before the current
    // page and page -1 to represent an ellipsis after the current page. No real difference between
    // these two ellipsis values, but distinct so we don't have duplicate React keys.
    let pageNumbers;
    if (total <= 9) {
        // A total page count of nine or fewer has no ellipses.
        pageNumbers = _.range(1, total + 1);
    } else {
        // With more than nine pages, build a cluster of pages around the current page.
        const clusterMin = Math.min(Math.max(1, currentPage - 2), total - 6);
        const clusterMax = Math.max(Math.min(currentPage + 2, total), 7);
        const clusterPageNumbers = _.range(clusterMin, clusterMax + 1); // _.range ends at max - 1

        // Determine whether we need an ellipsis before the cluster, or continuous page numbers.
        const prevFiller = clusterMin >= 4 ? [1, 0] : _.range(1, clusterMin);

        // Determine whether we need an ellipsis after the cluster, or continuous page numbers.
        const nextFiller = clusterMax <= total - 3 ? [-1, total] : _.range(clusterMax + 1, total + 1);

        // Put together the entire sequence of displayed page numbers:
        // prevFiller - extendClusterPrev - clusterPageNumbers - extendClusterNext - nextFiller
        pageNumbers = prevFiller.concat(clusterPageNumbers, nextFiller);
    }

    // Calculate the maximum number of digits in a page number.
    const pageNumberWidth = 10 + total.toString().length * 10;

    const pageNumberClick = (pageNumber) => {
        if (pageNumber !== currentPage) {
            clickHandler(pageNumber);
        }
    };

    const prevClick = () => {
        if (currentPage !== 1) {
            clickHandler(currentPage - 1);
        }
    };

    const nextClick = () => {
        if (currentPage !== total) {
            clickHandler(currentPage + 1);
        }
    };

    return (
        <nav className="pager-multi" aria-label="Pagination">
            <ul>
                <li className={`pager-multi__page pager-multi__page--arrow${currentPage === 1 ? ' pager-multi__page--arrow-disabled' : ''}`}>
                    <button type="button" onClick={prevClick} aria-label="Previous page" aria-disabled={currentPage === 1}>
                        <ChevronLeft />
                    </button>
                </li>
                {pageNumbers.map((pageNumber) => {
                    // Ellipses pages.
                    if (pageNumber === 0 || pageNumber === -1) {
                        return <li key={pageNumber} className="pager-multi__page pager-multi__page--skip" style={{ width: pageNumberWidth }}>&hellip;</li>;
                    }

                    // Regular clickable pages.
                    const isCurrentPage = pageNumber === currentPage;
                    return (
                        <li key={pageNumber} className={`pager-multi__page${currentPage === pageNumber ? ' pager-multi__page--current' : ''}`} style={{ width: pageNumberWidth }}>
                            <button
                                type="button"
                                onClick={() => pageNumberClick(pageNumber)}
                                aria-label={`Page ${pageNumber}${isCurrentPage ? ', current' : ''}`}
                                aria-current={isCurrentPage ? 'page' : null}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    );
                })}
                <li className={`pager-multi__page pager-multi__page--arrow${currentPage === total ? ' pager-multi__page--arrow-disabled' : ''}`}>
                    <button type="button" onClick={nextClick} aria-label="Next page" aria-disabled={currentPage === total}>
                        <ChevronRight />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

Pager.propTypes = {
    /** Currently selected page */
    currentPage: PropTypes.number.isRequired,
    /** Total number of pages */
    total: PropTypes.number.isRequired,
    /** Function to call when the user clicks a button in the pager; passes the new page number */
    clickHandler: PropTypes.func.isRequired,
};


const App = () => {
    const [page, setPage] = React.useState(1);
    const total = 130;

    const handlePagerClick = (requestedPage) => {
        console.log('click %s', requestedPage);
        setPage(requestedPage);
    };

    return (
        <div className="App">
            <Pager currentPage={page} total={total} clickHandler={handlePagerClick} />
        </div>
    );
};

export default App;
