const { User, Thought } = require('../models');

const userController = {
    // Get all Users
    getAllUsers(req, res) {
        User.find()
        .populate({
            path: 'thoughts',
            select: '-__v'
         })
        .then(dbUserData => {
            res.json(dbUserData);
        })
        .catch(err => {
            res.json(err);
        });
    },

    // Create a new User
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // Get User by ID
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate([
            { path: 'thoughts', select: '-__v' },
            { path: 'friends', select: '-__v' }
            ])
        .select('-__v')
        .then(dbUserData => {
            res.json(dbUserData);
        })
        .catch(err => {
            res.json(err);
        });
    },

    // update a user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
            if(!dbUserData){
                res.json({ message: 'no note with that id found'})
                return;
            }
            res.json(dbUserData)
            }).catch(err => {
            res.json(err)
            })
    },

    // delete a user
    deleteUser({ params }, res) {
        User.findOneAndDelete(
            { 
            _id: params.id 
            })
            .then(dbUserData => {
            if(!dbUserData){
                res.json({ message: 'No user with that id was found'});
                return;
            }
            User.updateMany( // remove user from others' friend groups
                { _id: { $in: dbUserData.friends } },
                { $pull: { friends: params.id } }
            )
            .then(() => {     
                    // remove any of this users thoughts
                    Thought.deleteMany({ username: dbUserData.username })
                    .then(() => {
                        res.json({ message: 'Successfully deleted user and their thoughts' }); 
                    })
                    .catch(err => { res.json(err) })
                })
                .catch(err => { res.json(err) })
            })
            .catch(err => { res.json(err) })
    },

    // FRIEND routes
    // Create a new Friend
    createFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId }, 
            { $addToSet: { friends: params.friendId } }, 
            { new: true, runValidators: true })
            .then(dbUserData => {
            if(!dbUserData){
                res.json({ message: 'no User with that id found'})
                return;
            }
            res.json(dbUserData)
            })
            .catch(err => { res.json(err) })
    },

    // Delete a Friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId }, 
            { $pull: { friends: params.friendId } }, 
            { new: true, runValidators: true })
            .then(dbUserData => {
            if(!dbUserData){
                res.json({ message: 'no Friend with that id was found'})
                return;
            }
            res.json({ message: 'Friend was successfully deleted'})
            }).catch(err => {
            res.json(err)
            })
    }

};

module.exports = userController;