const { string } = require('joi');
const mongoose = require('mongoose');

const GitMetadataSchema = new mongoose.Schema({
    repository_url: String,
    branch_name: String
});

const GitMetadata = mongoose.model('GitMetadata', GitMetadataSchema);


const LiveCode = mongoose.model('LiveCode', new mongoose.Schema({
    name: String,
    description: String, 
    git: GitMetadataSchema
}));

module.exports.LiveCode = LiveCode;
module.exports.GitMetadata = GitMetadata;
