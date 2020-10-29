import React from 'react';
import PropTypes from 'prop-types';
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


const Pager = ({ page, total, clickHandler }) => (
    <nav className="pager-multi">
        <ul>
            <li className="pager-multi__adjacent">
                <button type="button">
                    <ChevronLeft />
                </button>
            </li>
            <li className="pager-multi__adjacent">
                <button type="button">
                    <ChevronRight />
                </button>
            </li>
        </ul>
    </nav>
);

Pager.propTypes = {
    /** Currently selected page */
    page: PropTypes.number.isRequired,
    /** Total number of pages */
    total: PropTypes.number.isRequired,
    /** Function to call when the user clicks a button in the pager; passes the new page number */
    clickHandler: PropTypes.func.isRequired,
};


const App = () => {
    const [page, setPage] = React.useState(0);
    const total = 5;

    return (
        <div className="App">
            <Pager page={page} total={total} />
        </div>
    );
};

export default App;
