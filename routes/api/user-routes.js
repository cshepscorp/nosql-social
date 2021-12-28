const router = require('express').Router();
const { User, Thought } = require('../../models');

// Create a new User
router.post('/', ({ body }, res) => {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
});

router.get('/', (req, res) => {
    User.find()
    .then(dbUserData => {
        res.json(dbUserData);
      })
      .catch(err => {
        res.json(err);
      });
});

router.get('/:id', ({ params }, res) => {
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
});

// update a user
router.put('/:id', ({ params, body }, res) => {
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
});

// delete a user
router.delete('/:id', ({ params }, res) => {
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
                    res.json({ message: 'Successfully deleted user' }); 
                })
                .catch(err => { res.json(err) })
            })
            .catch(err => { res.json(err) })
        })
        .catch(err => { res.json(err) })
});

// FRIEND routes
// Create a new Friend
router.post('/:userId/friends/:friendId', ({ params }, res) => {
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
});

// Delete a Friend
router.delete('/:userId/friends/:friendId', ({ params }, res) => {
    User.findOneAndUpdate(
        { _id: params.userId }, 
        { $pull: { friends: params.friendId } }, 
        { new: true, runValidators: true })
        .then(dbUserData => {
          if(!dbUserData){
            res.json({ message: 'no User with that id found'})
            return;
          }
          res.json(dbUserData)
        }).catch(err => {
          res.json(err)
        })
});

module.exports = router;