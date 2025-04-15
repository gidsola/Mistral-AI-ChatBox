# electron-nextjs-starter-app

Welcome to the **electron-nextjs-starter-app**! This application seamlessly combines the power of Electron for desktop functionality with the efficiency of Next.js for modern web development. Whether you're a seasoned developer or just starting out, this starter app is designed to help you hit the ground running.

## Description

The **electron-nextjs-starter-app** is a versatile template that allows you to build cross-platform desktop applications using web technologies. With Electron handling the desktop environment and Next.js managing the web framework, you get the best of both worlds. This app is perfect for developers looking to create robust, high-performance desktop applications with a modern web interface.

## Configuration

Before running the application, ensure you configure the required values in the `config.mjs` file. These settings are essential for connecting to the Mistral AI API and customizing its behavior.

### Mistral AI Defaults

Open the `config.mjs` file and update the following section with your desired values:

```javascript
/** *************************************************************************
 * Mistral AI defaults
 */
Mistral: {
  /**
   * The API key for the Mistral AI.
   */
  api_key: 'your-api-key-here', // Replace with your actual API key
  /**
   * The completion body options.
   */
  completionOptions: {
    /**
     * The model to use for the Mistral AI.
     */
    model: 'mistral-large-latest', // Options: 'mistral-large-latest', 'mistral-small-latest', 'codestral-latest'
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
    // random_seed: 1337
  }
}
```

### Steps to Configure

1. Locate the `config.mjs` file in the project directory.
2. Replace the placeholder `api_key` value with your actual Mistral AI API key.
3. Adjust the `completionOptions` settings as needed to suit your application's requirements.

Once configured, you can proceed with running or building the application as described in the [Installation](#installation) and [Build Process](#build-process) sections.

**Note**: Ensure you keep your API key secure and do not expose it in public repositories.

## Development Mode Configuration

To ensure the app runs correctly in development mode, you need to set the `isDev` boolean inside `main.js`. This flag determines whether the app is running in development or production mode. In the future, this configuration will be moved to a dedicated `config/env` file for better maintainability.

## Installation

Getting started is easy! Follow these steps to set up your development environment:

1. Clone the repository:

    ```bash
    git clone https://github.com/gidsola/Mistral-AI-ChatBox.git
    cd electron-nextjs-starter-app
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Open two bash terminals:

    - In the first terminal, run the Next.js development server:

      ```bash
      npm run dev
      ```

    - In the second terminal, start the Electron app:

      ```bash
      npm start
      ```

And that's it! You should now have the app up and running.

## Build Process

Building the application is straightforward. Here are the commands you need:

- **Build Next.js**:

  ```bash
  npm run build:next
  ```

- **Build Electron**:

  ```bash
  npm run build:electron
  ```

- **Build both Next.js and Electron**:

  ```bash
  npm run build
  ```

These commands will compile your application and prepare it for distribution.

## Preview

Check out a quick preview of the app in action:

[![Preview](./preview.png)](./preview.mp4)


**Happy coding! 🚀**