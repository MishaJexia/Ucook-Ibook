const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const validRegistrationInput = require ('../validation/registration');
const validConnectionInput = require('../validation/connection');

router.route('/registration')
    .post((req, res) => {
        const { isValid, errors } = validRegistrationInput(req.body)

        if (!isValid) {
            return res.status(404).json(errors)
        }

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    errors.email = 'This email is already exist'
                    return res.status(404).json(errors)
                }

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        const newUser = new User({
                            login: req.body.login,
                            email: req.body.email,
                            password: hash
                        })

                        newUser.save()
                            .then(newUser => res.json(newUser))
                            .catch(err => console.log(err))
                    })
                })
            })
})

router.route('/connection')
    .post((req, res) => {
        const { errors, isValid } = validConnectionInput(req.body)

        if (!isValid) {
            return res.status(404).json(errors)
        }

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1d' }, function (err, token) {
                                return res.json({
                                    success: true,
                                    token: token
                                })
                            })
                        } else {
                            errors.password = 'Password is incorrect'
                            return res.status(404).json(errors)
                        }
                    })
                } else {
                    errors.email = 'User not found'
                    return res.status(404).json(errors)
                }
            })
})

router.route('/')
    .get( passport.authenticate('jwt', { session: false }),(req, res) => {
        console.log('here')
        res.json({
            _id: req.user._id,
            login: req.user.login,
            email: req.user.email,
            followers: req.user.followers,
            following: req.user.following
        })
})

router.route('/recipeConnect')
    .get( passport.authenticate('jwt', { session: false }),(req, res) => {
        res.json({
            _id: req.user._id,
            login: req.user.login,
            email: req.user.email,
            followers: req.user.followers,
            following: req.user.following
        })
})

router.route('/homeConnect')
    .get( passport.authenticate('jwt', { session: false }),(req, res) => {
        res.json({
            _id: req.user._id,
            login: req.user.login,
            email: req.user.email,
            followers: req.user.followers,
            following: req.user.following
        })
})

router.route('/follow')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
            User.findOneAndUpdate({
                _id: req.user.id
            }, {
                $push: { following: req.body.userId }
            },
            { new: true })
            .then(user => {
                User.findOneAndUpdate({
                    _id: req.body.userId
                }, {
                    $push: { followers: req.user.id }
                }, { new: true })
                .then(user => res.json({ userId: req.body.userId }))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
})

router.route('/unfollow')
    .post(
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
            User.findOneAndUpdate({
                _id: req.user.id
            }, {
                $pull: { following: req.body.userId }
            }, { new: true })
            .then(user => {
                User.findOneAndUpdate({
                    _id: req.body.userId
                }, {
                    $pull: { followers: req.user.id }
                }, { new: true })
                .then(user => res.json({ userId: req.body.userId }))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
)

router.route('/Api')
    .get( passport.authenticate('jwt', { session: false }),(req, res) => {
        res.json({
            _id: req.user._id,
            login: req.user.login,
            email: req.user.email,
            followers: req.user.followers,
            following: req.user.following
        })
})

router.route('/about')
    .get( passport.authenticate('jwt', { session: false }),(req, res) => {
        res.json({
            _id: req.user._id,
            login: req.user.login,
            email: req.user.email,
            followers: req.user.followers,
            following: req.user.following
        })
})

router.route('/search')
    .post((req, res) => {
        User.findOne({
            $or: [
                {email: req.body.text},
                {login: req.body.text}
            ]
        })
        .then(user => res.json({ userId: user._id }))
        .catch(err => res.status(404).json({ msg: 'Not found'}))
})

router.route('/:id')
    .get((req, res) => {
        User.findById(req.params.id)
        .then(user => {
            if (user) {
                return res.json({
                    _id: user._id,
                    login: user.login,
                    email: user.email,
                    followers: user.followers,
                    following: user.following
                })
            } else {
                return res.status(404).json({ msg: 'User not found'})
            }
        })
        .catch(err => console.log(err))
    })

module.exports = router