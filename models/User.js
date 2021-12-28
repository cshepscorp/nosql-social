const { Schema, model } = require('mongoose');

const UserSchema = new Schema (
    {
        username: {
            type: String,
            required: 'Please enter a valid username',
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: 'Please enter a valid email address',
            unique: true,
            match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId, // 
                ref: 'Thought' // data comes from the Thought model
                // The ref property is especially important because it tells the Pizza model which documents to search to find the right comments
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId, // 
                ref: 'User' // data comes from the Thought model
            }
        ]
    },
    // tell the schema that it can use virtuals
    {
        toJSON: {
            virtuals: true
        },
        id: false // set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    }
);

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;