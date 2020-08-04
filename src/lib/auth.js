module.exports = {

    ValidSession(req,res,next){
        if (req.isAuthenticated()) {
            return next();
        }
        return  res.redirect('/login');
    },

    IsNotSession(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }
        return  res.redirect('/profile');

    }

};