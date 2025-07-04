function allowRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.role)) return res.status(403).send('Access denied');
        next();
    };
}

module.exports = allowRoles;
