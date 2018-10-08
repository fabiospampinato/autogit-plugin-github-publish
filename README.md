# Autogit Plugin - Github Publish

A plugin for publishing repositories to GitHub.

## Install

```sh
npm install --save autogit-plugin-github-publish
```

## Usage

#### Options

This plugin uses the following options object:

```js
{
  remote: 'origin', // Using this name for the newly created repository
  token: '', // GitHub token
  message: 'Initial commit', // Commit message for the initial commit, set it to false to disable this
  force: false, // Don't ask for confirmation
  private: false, // Don't publish as private
  ssh: true // Use SSH rather than HTTPS
}
```

#### Configuration

Add this plugin to a command:

```js
const publish = require ( 'autogit-plugin-github-publish' );

module.exports = {
  commands: {
    'my-command': [
      publish ({ token: 'MY_GITHUB_TOKEN' })
    ]
  }
}
```

## License

MIT © Fabio Spampinato
