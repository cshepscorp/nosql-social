const router = require('express').Router();
const { User, Thought } = require('../../models');

// Create a new Thought
router.post('/', ({ body }, res) => {
    Thought.create(body)
    .then(dbThoughtData => {
        User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: dbThoughtData._id } },
            { new: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.status(400).json(err));
    
});

// Get thoughts
router.get('/', (req, res) => {
    Thought.find()
    .then(dbThoughtData => {
        res.json(dbThoughtData);
      })
      .catch(err => {
        res.json(err);
      });
});

// update a thought
router.put('/:id', ({ params, body }, res) => {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
          if(!dbThoughtData){
            res.json({ message: 'no thought with that id found'})
            return;
          }
          res.json(dbThoughtData)
        }).catch(err => {
          res.json(err)
        })
});

// react to a thought
router.post('/:thoughtId/reactions/', ({ params, body }, res) => {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId }, 
        { $addToSet: { reactions: body }}, 
        { new: true, runValidators: true })
        .then(dbThoughtData => {
          if(!dbThoughtData){
            res.json({ message: 'no thought with that id found'})
            return;
          }
          res.json(dbThoughtData);
        }).catch(err => {
          res.json(err)
        })
});

// delete a reaction to a thought
router.delete('/:thoughtId/reactions/:reactionId', ({ params }, res) => {
    console.log('=======thought Id========');
    console.log(params.thoughtId);
    console.log('=======reaction Id========');
    console.log(params.reactionId)
    console.log('===============');
    Thought.findOneAndUpdate(
        { _id: params.thoughtId }, 
        { $pull: { reactions: { reactionId: params.reactionId } } }, 
        { new: true })
        .then(dbThoughtData => {
          if(!dbThoughtData){
            res.json({ message: 'no thought with that id found' })
            return;
          }
          res.json(dbThoughtData);
        }).catch(err => {
          res.json(err)
        })
});

router.get('/:id', ({ params }, res) => {
    Thought.findOne({ _id: params.id })
      .populate({ 
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
    .then(dbThoughtData => {
        res.json(dbThoughtData);
      })
      .catch(err => {
        res.json(err);
      });
});

// delete a thought
router.delete('/:id', ({ params }, res) => {
    Thought.findOneAndDelete(
        { 
          _id: params.id 
        }).then(dbThoughtData => {
          if(!dbThoughtData){
            res.json({ message: 'No thought with that id was found'})
            return;
          }
          res.json(dbThoughtData)
        }).catch(err => res.json(err))
});

module.exports = router;