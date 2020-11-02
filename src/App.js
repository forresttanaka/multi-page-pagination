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
 * Displays a multi-page pager control that lets the user choose a page of data to view, with
 * ellipses representing skipped pages to save horizontal space. Previous/next arrows on either
 * end of the component allow the user to move to the previous and next page to the current page.
 * We have four cases to consider based on the total page count:
 *
 * Nine or fewer: Straight sequence of pages with no ellipses ([x] indicates current page):
 * <  1   2   3   4   5  [6]  7   8   9  >
 *
 * More than nine with the current page towards the left end ('.' indicates ellipsis):
 * <  1   2  [3]  4   5   6   7   .   20  >
 *
 * More than nine with the current page towards the right end:
 * <  1   .   14   15  [16]  17   18   19   20  >
 *
 * More than nine with the current page not near either end:
 * <  1   .   11   12  [13]  14   15   .   20  >
 *
 * For cases with more than nine pages, Pager attempts to keep a cluster of visible page numbers
 * surrounding the current page so that the user can see and select the two preceding and two
 * succeeding page numbers, except when the current page gets to the extreme ends of the page
 * range and fewer than two page numbers exist on one side of the cluster. When the current page
 * approaches the ends of the page range, more than two visible pages appear in the cluster on the
 * side facing the near end of the page range. This allowance keeps the width of the entire Pager
 * component consistent regardless of the current page number, so that the previous/next buttons
 * don't shift around horizontally.
 */
const Pager = ({ currentPage, total, clickHandler }) => {
    // Create the array of 1-based page numbers, with page 0 to represent an ellipsis before the
    // current page and page -1 to represent an ellipsis after the current page. No real difference
    // between these two ellipsis values, but Pager uses distinct values so we don't have duplicate
    // React keys. No point memoizing `pageNumbers` as it needs recalculating when any prop changes.
    let pageNumbers;
    if (total <= 9) {
        // A total page count of nine or fewer has no ellipses -- just a straight array of
        // sequential numbers.
        pageNumbers = _.range(1, total + 1); // _.range ends at max - 1
    } else {
        // With more than nine pages, build a cluster of pages around the current page, first by
        // determining the minimum and maximum page numbers for the cluster. Allow for filling in
        // extra numbers in the cluster for cases where the current page number approches the ends
        // of the page range, and cutting off the page numbers when the current page is within two
        // pages of either end of the page range.
        const clusterMin = Math.min(Math.max(1, currentPage - 2), total - 6);
        const clusterMax = Math.max(Math.min(currentPage + 2, total), 7);
        const clusterPageNumbers = _.range(clusterMin, clusterMax + 1); // _.range ends at max - 1

        // Determine whether we need an ellipsis before the cluster, or continuous page numbers. If
        // we need an ellipsis before the cluster, then we need an array with page one and a "0" to
        // indicate the left ellipsis
        const prevFiller = clusterMin >= 4 ? [1, 0] : _.range(1, clusterMin);

        // Determine whether we need an ellipsis after the cluster, or continuous page numbers. If
        // we need an ellipsis after the cluster, then we need an array with a -1 to indicate the
        // right ellipsis followed by the last page number.
        const nextFiller = clusterMax <= total - 3 ? [-1, total] : _.range(clusterMax + 1, total + 1);

        // Put together the entire sequence of displayed page numbers and ellipses:
        // prevFiller -- clusterPageNumbers -- nextFiller
        pageNumbers = prevFiller.concat(clusterPageNumbers, nextFiller);
    }

    // Calculate the pixel width of every page number and ellipsis based on the maximum number of
    // digits in a page number.
    const pageNumberWidth = 10 + (total.toString().length * 10);

    // Called when the user clicks on a page number.
    const pageNumberClick = (pageNumber) => {
        if (pageNumber !== currentPage) {
            clickHandler(pageNumber);
        }
    };

    // Called when the user clicks the previous-page-number arrow.
    const prevClick = () => {
        if (currentPage !== 1) {
            clickHandler(currentPage - 1);
        }
    };

    // Called when the user clicks the next-page-number arrow.
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
    const total = 9;

    const handlePagerClick = (requestedPage) => {
        setPage(requestedPage);
    };

    return (
        <div className="App">
            <Pager currentPage={page} total={total} clickHandler={handlePagerClick} />
        </div>
    );
};

export default App;
