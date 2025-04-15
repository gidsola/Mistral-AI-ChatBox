const
  Config = {
    /** *************************************************************************
     * Mistral AI defaults
     */
    Mistral: {
      /**
       * The API key for the Mistral AI.
       */
      api_key: 'fastasfastcanbe',
      /**
       * The completion body options.
       */
      completionOptions: {
        /**
         * The model to use for the Mistral AI.
         */
        model: 'mistral-large-latest', //  'mistral-large-latest', 'mistral-large-latest', 'codestral-latest'
        /**
         * The top-p value for sampling. Controls the diversity of the generated output.
         */
        top_p: 0.8,
        /**
         * The maximum number of tokens to generate.
         */
        max_tokens: 4096,
        /**
         * Whether to stream the output or return it as a single response.
         */
        stream: true,
        /**
         * Whether to use safe prompt mode. When enabled, the AI will avoid generating harmful or unsafe content.
         */
        safe_prompt: true,
        /**
         * The random seed to use for generating the output.
         */
        //random_seed: 1337
      }
    },
    codestral: {
      codestralUse: false,
      codestral_api_key: 'youllnevercatchme',
      chat_endpoint: 'https://codestral.mistral.ai/v1/chat/completions',
      completionOptions: {
        /**
         * The model to use for the Mistral AI.
         */
        model: 'codestral-latest', //  'mistral-large-latest', 'codestral-latest'
        /**
         * The top-p value for sampling. Controls the diversity of the generated output.
         */
        top_p: 0.8,
        /**
         * The maximum number of tokens to generate.
         */
        max_tokens: 4096,
        /**
         * Whether to stream the output or return it as a single response.
         */
        stream: true,
        /**
         * Whether to use safe prompt mode. When enabled, the AI will avoid generating harmful or unsafe content.
         */
        safe_prompt: true,
        /**
         * The random seed to use for generating the output.
         */
        //random_seed: 1337
      }
    }
  };

export default Config;
