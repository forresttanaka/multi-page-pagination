import React from 'react';
import MultiPagination from './multi-pagination';
import './App.css';
import './pager.scss';


const App = () => {
    const [page, setPage] = React.useState(1);
    const total = 20;

    const handlePagerClick = (requestedPage) => {
        setPage(requestedPage);
    };

    return (
        <div className="App">
            <MultiPagination currentPage={page} total={total} clickHandler={handlePagerClick} />
        </div>
    );
};

export default App;
