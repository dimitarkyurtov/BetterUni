/**
 * Created by adminuser on 4/14/2017.
 */
const Article = require('mongoose').model('Article');
const Comment = require('mongoose').model('Comment');
module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },
    createPost: (req, res) => {
        let errorMsg = '';
        if (!req.isAuthenticated()){
            errorMsg = 'Sorry, you are not logged in!';
        }else if (!req.body.title){
            errorMsg = 'Title should not be empty!';
        }else if (!req.body.content){
            errorMsg = 'Content should not be empty!';
        }

        if (errorMsg){
            res.render('article/create', {
                error: errorMsg
            });
            return;
        }

        let userId = req.user.id;
        req.body.author = userId;
        Article.create(req.body).then(article =>{
            req.user.articles.push(article.id);
            req.user.save(err =>{
                if (err){
                    res.render('/article/create', {
                        error: error.message
                    })
                }else{
                    res.redirect('/');
                }
            });
        })
    },
    detailsGet: (req, res) => {
        let id = req.params.id;



        Article.findById(id).populate('author').populate({
            path:'comments',
            populate: {
                path:'author'
                }}).then(article => {
            let idd = article.comments;

            if (!req.isAuthenticated()){
                res.render('article/details2', article);
                return;
            }
            req.user.isInRole('Admin').then(isAdmin =>{
                if(!isAdmin && !req.user.isAuthor(article)){

                }else{
                    res.render('article/details', article);
                }
            })


        });
    },

    editGet: (req, res) => {
        let id = req.params.id;

        if (!req.isAuthenticated()){
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin =>{
                if(!isAdmin && !req.user.isAuthor(article)){
                    res.redirect('/');
                }else{
                    res.render('article/edit', article);
                }
            })


        });
    },

    editPost: (req, res) => {
        let id = req.params.id;


        let errorMsg = '';
        if (!req.isAuthenticated()){
            errorMsg = 'Sorry, you are not logged in!';
        }else if (!req.body.title){
            errorMsg = 'Title should not be empty!';
        }else if (!req.body.content){
            errorMsg = 'Content should not be empty!';
        }

        if (errorMsg){
            res.render('article/create', {
                error: errorMsg
            });
            return;
        }

        Article.update({_id: id}, {$set: {title: req.body.title, content: req.body.content}})
            .then(err =>{
                res.redirect(`/article/details/${id}`);
            })
    },

    deleteGet: (req, res) =>{
        let id = req.params.id;

        if (!req.isAuthenticated()){
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin =>{
                if(!isAdmin && !req.user.isAuthor(article)){
                    res.redirect('/');
                }else{
                    res.render('article/delete', article);
                }
            })


        });
    },

    deletePost: (req, res) =>{
        let id = req.params.id;
        Article.findOneAndRemove({_id: id}).populate('author').then(article =>{
            let author = article.author;

            let index = author.articles.indexOf(article.id);

            if (index < 0){
                let errorMsg = 'Article was not found for that author!';
                res.render('article/delete', {error: errorMsg});
            }else {
                let count = 1;
                author.articles.splice(index, count);
                author.save().then((user) =>{
                    res.redirect(`/`);
                });
            }
        })
    },

    commentGet: (req, res) =>{
        let id = req.params.id;
        Article.findById(id).then(article => {
            res.render('article/comment', article);
        })
    },

    commentPost: (req, res) =>{
        let id = req.params.id;

        Article.findById(id).then(article =>{
                let content = req.body.comment;
                   let authorr = req.user;

            Comment.create({author: authorr, comment: content}).then(comment =>{
                article.comments.push(comment.id);
                article.save();
            })

        })
        res.redirect(`/`);
    },

}