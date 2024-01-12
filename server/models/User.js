const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedRestaurants: [{
      type: Schema.Types.ObjectId,
      ref: 'Restaurant'
    }],
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }],
    orders: [{
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }]
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `restaurantCount` with the number of saved books we have
userSchema.virtual('restaurantCount').get(function () {
  return this.savedRestaurants.length;
});

const User = model('User', userSchema);

module.exports = User;
