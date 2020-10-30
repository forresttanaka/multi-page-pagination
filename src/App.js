import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import './App.css';
import './pager.scss';


const ChevronLeft = () => (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 265 436.7">
        <path d="M7,201.4L201.4,7c9.4-9.4,24.6-9.4,33.9,0L258,29.7c9.4,9.4,9.4,24.5,0,33.9L104,218.3l154,154.8c9.3,9.4,9.3,24.5,0,33.9 l-22.7,22.7c-9.4,9.4-24.6,9.4-33.9,0L7,235.3C-2.3,225.9-2.3,210.7,7,201.4z" />
    </svg>
);


const ChevronRight = () => (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 265 436.7">
        <path d="M258,235.3L63.6,429.7c-9.4,9.4-24.6,9.4-33.9,0L7,407c-9.4-9.4-9.4-24.5,0-33.9l154-154.7L7,63.6c-9.3-9.4-9.3-24.5,0-33.9 L29.7,7c9.4-9.4,24.6-9.4,33.9,0L258,201.4C267.4,210.7,267.4,225.9,258,235.3z" />
    </svg>
);


const Pager = ({ currentPage, total, clickHandler }) => {
    // Create the array of page numbers, with page 0 to represent an ellipsis before the current
    // page and page -1 to represent an ellipsis after the current page.
    let pageNumbers;
    if (total <= 9) {
        // A total page count of nine or fewer has no ellipses.
        pageNumbers = _.range(1, total + 1);
    } else {
        let prevFiller;
        let nextFiller;

        // With more than nine pages, build a cluster of pages around the current page.
        const clusterMin = Math.max(1, currentPage - 2);
        const clusterMax = Math.min(currentPage + 2, total);
        const clusterPageNumbers = _.range(clusterMin, clusterMax + 1); // _.range ends at max - 1

        // Determine whether we need an ellipsis before the cluster, or continuous page numbers.
        if (clusterMin >= 4) {
            // Need ellipsis and a 1
            prevFiller = [1, 0];
        } else {
            prevFiller = clusterMin === 1 ? [] : _.range(1, clusterMin);
        }

        // Determine whether we need an ellipsis after the cluster, or continuous page numbers.
        if (clusterMax <= total - 3) {
            // Need ellipsis and a 1
            nextFiller = [-1, total];
        } else {
            nextFiller = _.range(clusterMax + 1, total + 1);
        }

        // Put together the entire sequence of displayed page numbers.
        pageNumbers = prevFiller.concat(clusterPageNumbers).concat(nextFiller);
    }

    const pageNumberClick = (pageNumber) => {
        clickHandler(pageNumber);
    };

    const prevClick = () => {
        clickHandler(currentPage - 1);
    };

    const nextClick = () => {
        clickHandler(currentPage + 1);
    };

    return (
        <nav className="pager-multi">
            <ul>
                <li className="pager-multi__page pager-multi__page--arrow">
                    <button type="button" onClick={prevClick} disabled={currentPage === 1}>
                        <ChevronLeft />
                    </button>
                </li>
                {pageNumbers.map((pageNumber) => {
                    if (pageNumber === 0 || pageNumber === -1) {
                        return <li key={pageNumber} className="pager-multi__page pager-multi__page--skip">&hellip;</li>;
                    }
                    return (
                        <li key={pageNumber} className="pager-multi__page">
                            <button type="button" onClick={() => pageNumberClick(pageNumber)} disabled={pageNumber === currentPage}>{pageNumber}</button>
                        </li>
                    );
                })}
                <li className="pager-multi__page page pager-multi__page--arrow">
                    <button type="button" onClick={nextClick} disabled={currentPage === total}>
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
    const total = 30;

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
