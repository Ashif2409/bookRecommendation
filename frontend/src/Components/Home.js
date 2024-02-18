import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const Home = ({ data }) => {
    const [bookDetail, setBookDetail] = useState('')
    const [books, setBooks] = useState([]);
    const [showFullDesc, setShowFullDesc] = useState(Array(books.length).fill(false));
    const [ratings, setRatings] = useState(Array(books.length).fill(0));
    const [reviews, setReviews] = useState(Array(books.length).fill(''));
    const [userReviews, setUserReviews] = useState([]);
    const [recBookDetail, setRecBookDetail] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [homePage, setHomePage] = useState(true);
    const navigate = useNavigate();

    const handleStarClick = (index, value) => {
        setRatings((prevRatings) => {
            const newRatings = [...prevRatings];
            newRatings[index] = value;
            return newRatings;
        });
    };

    const handleReviewChange = (index, e) => {
        const newReviews = [...reviews];
        newReviews[index] = e.target.value;
        setReviews(newReviews);
    };

    const handleSubmitReview = async (index) => {

        const bookId = books[index].id;
        const rating = ratings[index];
        const reviewText = reviews[index];
        const userId = data._id
        try {
            // Send the review data for the current book to the backend
            await axios.post("book-recommendation-woad.vercel.app/review", { bookId: bookId, rate: rating, review: reviewText, userId: userId })
                .then(res => console.log(res))
            // Clear the review text after submission
            const newReviews = [...reviews];
            newReviews[index] = '';
            setReviews(newReviews);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setHomePage(false);
        if (bookDetail !== '') {
            const books = axios.get('https://www.googleapis.com/books/v1/volumes?q=' + bookDetail + '&key=AIzaSyAYe-VrnXSxyCWFWapGIdlYiLNiDNlyHSs')
                .then(res => {
                    setBooks(res.data.items);
                    setRatings(Array(res.data.items.length).fill(0));
                    setReviews(Array(res.data.items.length).fill(''));
                })
                .catch(err => console.log(err))
        }
    }
    const handleChange = (e) => {
        e.preventDefault();
        setBookDetail(e.target.value);
    }
    const handleBookDetailClick = (book) => {
        navigate('/details', { state: { book } });
    };

    const fetchUserReviews = async () => {
        await axios.post('book-recommendation-woad.vercel.app/user-reviews', { userId: data._id })
            .then(res => {
                setUserReviews(res.data);
                const bookIds = res.data.map(review => review.bookId);
                if (bookIds.length > 0) {
                    Promise.all(
                        bookIds.map(async bookId =>
                            await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`, {
                                params: {
                                    key: 'AIzaSyAYe-VrnXSxyCWFWapGIdlYiLNiDNlyHSs'
                                }
                            })
                        )
                    ).then(responses => {
                        const recBooks = responses.map(response => response.data);
                        setRecBookDetail(recBooks);
                    }).catch(error => {
                        console.error('Error fetching book details:', error);
                    });
                } else {
                    // console.log('No bookIds to fetch');
                }

            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchUserReviews();
    }, []);

    return (
        <div className='Homemain flex flex-col items-center m-auto bg-gray-900 min-h-screen'>
            <div>
                <h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
                    Book Recommendation Application
                </h1>
            </div>
            <div>
                <p className="text-white">Hii {data.name}, Welcome to the book recommendation app.</p>
            </div>
            <div>
                <form className='flex flex-col gap-10' onSubmit={handleSubmit}>
                    <input
                        name='title'
                        className="searchByTitle w-full md:w-64 lg:w-80 xl:w-96 border rounded-md p-2 focus:outline-none"
                        placeholder=' Search by author, genre, or publisher'
                        value={bookDetail}
                        onChange={handleChange}
                    />
                    <button type='submit' className="w-full bg-gray-700 text-white rounded-md p-2 font-semibold hover:bg-gray-800 focus:outline-none focus:bg-blue-600">
                        Search
                    </button>
                    <button className="w-full bg-gray-700 text-white rounded-md p-2 font-semibold hover:bg-gray-800 focus:outline-none focus:bg-blue-600" onClick={() => { navigate('/') }}>Logout</button>
                </form>

            </div>
            {
                homePage ?
                    (
                        <div className='flex flex-col items-center '>
                            <h2 className="text-2xl font-bold text-white">Your Book Reviews</h2>
                            <button
                                onClick={fetchUserReviews}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                            >
                                Refresh Reviews
                            </button>
                            <div className="flex flex-wrap gap-4 items-center justify-center mt-6">
                                {
                                    recBookDetail.map((item, index) => (
                                        <div key={index} className="max-w-md bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                                            {item.volumeInfo && (
                                                <>
                                                    <img className="w-full h-56 mt-2 object-contain rounded-t-lg" src={item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.smallThumbnail} alt={item.volumeInfo.title} />
                                                    <div className="p-5">
                                                        <h5 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Author: {item.volumeInfo.authors?.join(', ') || 'Unknown'}</h5>
                                                        <p className="mb-2 text-sm text-gray-700 dark:text-gray-400">Genre: {item.volumeInfo.categories?.join(', ') || 'Unknown'}</p>
                                                        <p className="mb-2 text-sm text-gray-700 dark:text-gray-400">Publication Date: {item.volumeInfo.publishedDate || 'Unknown'}</p>
                                                        {userReviews.map((review, index) => (
                                                            review.bookId === item.id &&
                                                            <div key={index}>
                                                                <p>Rating: {review.rate}</p>
                                                                <p>Review: {review.review}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-wrap gap-4 items-center justify-center mt-6 w-full'>
                            {
                                books.map((item, index) => {
                                    const imgSrc = item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.smallThumbnail;
                                    const title = item.volumeInfo.title;
                                    const authors = item.volumeInfo.authors?.join(', ') || 'Unknown';
                                    const genre = item.volumeInfo.categories?.join(', ') || 'Unknown';
                                    const publicationDate = item.volumeInfo.publishedDate || 'Unknown';

                                    return (
                                        <div key={item.id} className="max-w-md bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700" style={{ width: '350px', height: '726px' }}>

                                            <img className="w-full h-56 mt-2 object-contain  rounded-t-lg" src={imgSrc} alt={title} />

                                            <div className="p-5">

                                                <h5 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{title}</h5>

                                                <p className="mb-2 text-sm text-gray-700 dark:text-gray-400">Author: {authors}</p>
                                                <p className="mb-2 text-sm text-gray-700 dark:text-gray-400">Genre: {genre}</p>
                                                <p className="mb-2 text-sm text-gray-700 dark:text-gray-400">Publication Date: {publicationDate}</p>
                                                <button onClick={() => handleBookDetailClick(item)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                    Book Detail
                                                </button>
                                                <div className="mb-2">
                                                    {[1, 2, 3, 4, 5].map((value) => (
                                                        <span
                                                            key={value}
                                                            onClick={() => handleStarClick(index, value)}
                                                            style={{ cursor: 'pointer', color: value <= ratings[index] ? 'gold' : 'gray' }}
                                                        >
                                                            &#9733;
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="review" className="block text-sm text-gray-700 dark:text-gray-400">Review:</label>
                                                    <textarea className='w-full h-20' value={reviews[index]} onChange={(e) => handleReviewChange(index, e)} />
                                                </div>
                                                <button onClick={() => handleSubmitReview(index)} className="bg-blue-500 text-white px-3 py-1 rounded-md">Submit Review</button>
                                            </div>
                                        </div>
                                    );
                                })}

                        </div>
                    )
            }
        </div>
    )
}
