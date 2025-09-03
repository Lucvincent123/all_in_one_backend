export const errorHandler = (error: Error): void => {
    const errorMessage = error.message || 'Unknown error occurred';
    switch (errorMessage) {
        case 'duplicate key value violates unique constraint "users_email_key"':
            throw new Error('Email already exists. Please use a different email address.');
        case 'relation "users" does not exist':
            throw new Error('Users table does not exist. Please create the table first.');
        // case errorMessage.match(/^syntax error at or near ".+"/) ? errorMessage : null: // Example error, adjust as needed
        //     throw new Error('There is a syntax error in your SQL query. Please check the query syntax.');
        case 'relation "users" already exists':
            throw new Error('Users table already exists. Please drop the table if you want to recreate it.');
        default:
            throw new Error(errorMessage);
    }
};
