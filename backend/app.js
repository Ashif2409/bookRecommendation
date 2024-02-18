const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

app.use(cors({
  origin: [''], 
  methods: ['GET', 'POST'],
   credentials: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/bookRec").then(res => {
    console.log("Succesfully db Connected")
}).catch(err => console.log(err));

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

const bookSchema = mongoose.Schema({
    userId: String,
    bookReviews: [
        {
            bookId: String,
            rate: String,
            review: String
        }
    ]
})

const User = mongoose.model('user', userSchema);
const BookUser = mongoose.model('book', bookSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};
const verifyPassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return true;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
};

app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.send("User with this email id is Already Existed");
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        res.send("Successfully Saved");
    } catch (error) {
        console.error('Error in registration:', error);
        res.send("Error in registration");
    }
});
app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const existingUser = await User.findOne({ name: name });

        if (existingUser) {
            storedHashedPassword = existingUser.password;
            const isMatch = await verifyPassword(password, storedHashedPassword);
            if (isMatch) {
                res.send({ message: "Welcome to the Book Recommendation app", user: existingUser });
            } else {
                console.log("Your Pasword is Wrong");
            }
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/review', async (req, res) => {
    try {
        const { userId } = req.body;
        const existingUser = await BookUser.findOne({ userId: userId });
        const { bookId, rate, review } = req.body;
        if (existingUser) {
                existingUser.bookReviews.forEach(async (item) => {
                    const existingReviewIndex = existingUser.bookReviews.findIndex(review => review.bookId === bookId);
                    console.log(existingReviewIndex)
                    if (existingReviewIndex !== -1) {
                        existingUser.bookReviews[existingReviewIndex].rate = rate;
                        existingUser.bookReviews[existingReviewIndex].review = review;
                    } else {
                        existingUser.bookReviews.push({
                            bookId: bookId,
                            rate: rate,
                            review: review
                        });
                    }
                });
            await existingUser.save();
            res.send("Book reviews updated successfully.");
        } else {
            const bookUser = new BookUser({
                userId: userId,
                bookReviews: { bookId, rate, review }
            });

            await bookUser.save();
            res.send("New book user created with reviews.");
        }
    } catch (error) {
        console.error("Error handling book reviews:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/user-reviews', async (req, res) => {
    const { userId } = req.body;
    try {
        const existingUser = await BookUser.findOne({ userId: userId });
        if (existingUser) {
            const userReviews = existingUser.bookReviews.map(review => ({
                bookId: review.bookId,
                rate: review.rate,
                review: review.review
            }));
            res.send(userReviews);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error retrieving user reviews:", error);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(port, () => {
    console.log("Backend is Connected");
});
