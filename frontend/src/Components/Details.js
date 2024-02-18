import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function Details() {
    const location = useLocation();
    const { book } = location.state;
    const navigate = useNavigate();
    const handleBack = ()=>{
        navigate('/home');
    }
    const imgSrc = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.smallThumbnail;
    return (
        <div className="container mx-auto p-4">
    <h2 className="text-3xl font-bold mb-6">{book.volumeInfo.title}</h2>
    <div className="flex flex-col md:flex-row">
        <img
            src={imgSrc}
            alt={book.volumeInfo.title}
            className="w-full md:w-2/4 rounded-lg mb-6 md:mr-8"
        />
        <div className="w-full md:w-3/4">
            <p className="text-lg font-semibold mb-4">Author: {book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
            <p className="text-lg font-semibold mb-4">Publisher: {book.volumeInfo.publisher || 'Unknown'}</p>
            <p className="text-lg font-semibold mb-4">Publication Date: {book.volumeInfo.publishedDate || 'Unknown'}</p>
            <p className="text-lg font-semibold mb-4">Description:</p>
            <p className="text-lg mb-8">{book.volumeInfo.description || 'No description available'}</p>
            <button
                onClick={handleBack}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Back
            </button>
        </div>
    </div>
</div>

    );
}

export default Details;
