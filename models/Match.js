const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MatchSchema = new Schema({
    matchNo: String,
    team: [
        {
          teamName: String,
            votes: Number
        }
    ]
});
module.exports = mongoose.model('Match', MatchSchema);
