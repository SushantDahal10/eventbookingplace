import React, { useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="relative z-20 -mt-8 max-w-4xl mx-auto px-4">
            <form
                onSubmit={handleSearch}
                className="bg-white p-2 rounded-full shadow-xl flex flex-col md:flex-row items-center gap-2 border border-gray-100"
            >
                <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for events, venues..."
                        className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-colors md:ml-2 shadow-md hover:shadow-lg"
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
