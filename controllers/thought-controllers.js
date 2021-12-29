const { User, Thought } = require('../models');

const thoughtControllers = {
    // Create a new Thought
    createThought({ body }, res) {
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
        
    },

    // Get thoughts
    getAllThoughts(req, res) {
        Thought.find()
        .then(dbThoughtData => {
            res.json(dbThoughtData);
        })
        .catch(err => {
            res.json(err);
        });
    },

    // update a thought
    updateThought({ params, body }, res) {
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
    },

    // react to a thought
    createReaction({ params, body }, res)  {
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
    },

    // delete a reaction to a thought
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $pull: { reactions: { reactionId: params.reactionId } } }, 
            { new: true })
            .then(dbThoughtData => {
            if(!dbThoughtData){
                res.json({ message: 'no thought with that id found' })
                return;
            }
            res.json({ message: 'Reaction was successfully deleted' });
            }).catch(err => {
            res.json(err)
            })
    },

    getThoughtById({ params }, res) {
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
    },

    // delete a thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete(
            { 
            _id: params.id 
            }).then(dbThoughtData => {
            if(!dbThoughtData){
                res.json({ message: 'No thought with that id was found'})
                return;
            }
            res.json({ message: 'Thought was successfully deleted'})
            }).catch(err => res.json(err))
    }

};

module.exports = thoughtControllers;