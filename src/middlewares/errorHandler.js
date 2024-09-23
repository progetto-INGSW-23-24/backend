
const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

    const statusCode = err.statusCode || 500; 

    res.status(statusCode).json({
        success: false, 
        message: err.message || 'Internal Server Error', 
    }); 

}; 

export default errorHandler; 