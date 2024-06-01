const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../utils/db');
const { sendResetPasswordEmail } = require('./emailService');
require('dotenv').config();

const requestResetPassword = (email, req, callback) => {
    const query = 'SELECT * FROM MEMBER WHERE Email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) return callback(err);

        if (results.length === 0) {
            return callback(null, { message: 'Email not found', status: 404 });
        }

        const user = results[0];
        const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });

        sendResetPasswordEmail(email, token, req)
            .then(() => {
                console.log('Reset password email sent to:', email);
                callback(null, { message: 'Reset password email sent.' });
            })
            .catch(error => {
                console.error('Error sending reset password email:', error);
                callback(error);
            });
    });
};

const resetPassword = (token, newPassword, callback) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) return callback(err);

            const query = 'UPDATE MEMBER SET Password = ? WHERE UserID = ?';
            connection.query(query, [hashedPassword, userId], (err, result) => {
                if (err) return callback(err);
                callback(null, { message: 'Password reset successfully.' });
            });
        });
    } catch (err) {
        callback(err);
    }
};

module.exports = {
    requestResetPassword,
    resetPassword
};