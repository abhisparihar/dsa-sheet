import mongoose from 'mongoose';

const topicSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        level: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },
        subtopics: [
            {
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                youtubeLink: {
                    type: String
                },
                leetcodeLink: {
                    type: String
                },
                articleLink: {
                    type: String
                },
            },
        ],
    }
);


/**
 * @typedef Topic
 */
const Topic = mongoose.model('topics', topicSchema);

export default Topic;
