const User = require('./User');
const Image = require('./Image')

User.hasMany(Image, {foreignKey: 'user_id'})
Image.belongsTo(User)

module.exports = { User, Image };
