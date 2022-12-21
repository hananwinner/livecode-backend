const mongoose = require('mongoose');

const GitMetadataSchema = new mongoose.Schema({
    repository_url: String,
    branch_name: String
});

const GitMetadata = mongoose.model('GitMetadata', GitMetadataSchema);


const LiveCode = mongoose.model('LiveCode', new mongoose.Schema({
    author: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true, trim: true},
    description: { type: String, required: true, trim: true},
    git: {type: GitMetadataSchema, required: true},
    finalized: {type: Boolean, default: false},
    published: {type: Boolean, default: false},
    video_versions: [],
    code_changes: []
}));

module.exports.LiveCode = LiveCode;
module.exports.GitMetadata = GitMetadata;
