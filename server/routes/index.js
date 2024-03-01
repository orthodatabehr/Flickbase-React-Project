const express = require('express');
const router = express.Router();

// ROUTES
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const articlesRoute = require('./articles.route');

const routeIndex = [
    {
        path:'/auth',
        route: authRoute
    },
    {
        path:'/users',
        route: userRoute
    },
    {
        path:'/articles',
        route: articlesRoute
    }
]
// router.use(path,file)
routeIndex.forEach((route)=>{
    router.use(route.path, route.route)
})



module.exports = router;