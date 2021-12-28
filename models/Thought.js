const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
    {
        // set custom id to avoid confusion with parent comment _id; still going to have it generate the same type of ObjectId() value that the _id field typically does
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: 'You need to input a reaction',
            trim: true,
            validate: [({ length }) => length <= 280, 'Your reaction needs to be less than 280 characters.']
        },
        username: {
            type: String,
            required: 'You need to tell us your name',
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    // tell the schema that it can use getters (dateFormat)
    {
        toJSON: {
            getters: true
        }
    }
);

const ThoughtSchema = new Schema (
    {
        thoughtText: {
            type: String,
            required: 'Please enter a valid thought',
            validate: [({ length }) => length >= 1 && length <= 280, 'Your thought should be less than 280 characters.']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal) // references utils/dateFormat.js
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    },
    // tell the schema that it can use virtuals
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false // set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    }
)

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;