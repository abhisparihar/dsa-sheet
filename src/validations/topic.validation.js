import Joi from 'joi';

const add = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        level: Joi.string().required(),
        subtopics: Joi.array()
            .items(
                Joi.object({
                    name: Joi.string().required(),
                    youtubeLink: Joi.string().uri().required(),
                    leetcodeLink: Joi.string().uri().required(),
                    articleLink: Joi.string().uri().required(),
                    description: Joi.string().required(),
                })
            )
            .required(),
    }),
};

const addMultipleTopicsValidation = {
    body: Joi.array()
        .items(
            Joi.object({
                title: Joi.string().required(),
                level: Joi.string().valid('Easy', 'Medium', 'Hard').required(), // optional constraint for levels
                subtopics: Joi.array()
                    .items(
                        Joi.object({
                            name: Joi.string().required(),
                            youtubeLink: Joi.string().uri().required(),
                            leetcodeLink: Joi.string().uri().required(),
                            articleLink: Joi.string().uri().required(),
                            description: Joi.string().required(),
                        })
                    )
                    .min(1) // Ensure at least one subtopic
                    .required(),
            })
        )
        .min(1) // Ensure at least one topic is provided
        .required(),
};

export default { add, addMultipleTopicsValidation };