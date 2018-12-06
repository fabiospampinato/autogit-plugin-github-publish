
/* IMPORT */

import * as input from 'listr-input';
import * as octokit from '@octokit/rest';
import * as path from 'path';
import * as username from 'git-username';
import * as simpleGit from 'simple-git/promise';

/* GITHUB PUBLISH */

const defaultOptions = {
  remote: 'origin',
  token: '',
  message: 'Initial commit',
  force: false,
  private: false,
  ssh: true
};

function factory ( customOptions?: Partial<typeof defaultOptions> ) {

  const options = Object.assign ( {}, defaultOptions, customOptions );

  async function githubPublish ( config, repoPath, ctx, task ) {

    async function run () {

      const name = path.basename ( repoPath ),
            owner = username ({ cwd: repoPath }),
            git = simpleGit ( repoPath ),
            github = new octokit ();

      github.authenticate ({
        type: 'token',
        token: options.token
      });

      if ( owner ) {

        try {

          await github.repos.get ({ owner, repo: name });

          return task.output = 'Already published';

        } catch ( e ) {}

      }

      if ( config.dry ) return task.skip ();

      if ( options.message ) {

        try {

          git.silent ( true );

          await git.log ();

        } catch ( e ) {

          task.output = 'Making initial commit...';

          await git.add ( '-A' );
          await git.commit ( options.message );

        }

      }

      try {

        task.output = 'Creating repository...';

        const repo = await github.repos['create']({ name, private: options.private }); //TSC

        task.output = `Adding GitHub remote as "${options.remote}"...`;

        await git.addRemote ( options.remote, options.ssh ? repo.data.ssh_url : repo.data.clone_url );

        task.output = `Pushing all branches to "${options.remote}"...`;

        await git.push ( options.remote, '*:*' );

        task.output = 'Published to GitHub';

      } catch ( e ) {

        return task.skip ( 'Couldn\'t create the GitHub repository' );

      }

    }

    if ( !options.token ) return task.skip ( 'You need to provide a GitHub token' );

    if ( !options.force ) {

      return input ( 'Press enter to confirm:', { done: run } );

    } else {

      return run ();

    }

  };

  githubPublish['title'] = 'github publish';

  return githubPublish;

}

/* EXPORT */

export default factory;
