const router = require('express').Router();
const { User, Thought } = require('../../models');

// Create a new Thought
router.post('/:id', ({ params, body }, res) => {
    Thought.create(body)
    .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.id },
          { $push: { thoughts: _id } }, // All of the MongoDB-based functions like $push start with a dollar sign ($), making it easier to look at functionality and know what is built-in to MongoDB and what is a custom noun the developer is using
          { new: true, runValidators: true }
        );
      })
    .then(dbThoughtData => res.json(dbThoughtData))
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