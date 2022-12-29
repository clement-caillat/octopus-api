const checkMethods = (methods = ['GET']) => (req, res, next) => {
    if (methods.includes(req.method)){
        next();
    }
    else{
        res.status(405).json({
            message: 'Method not allowed'
        });
    }
};

module.exports = checkMethods;