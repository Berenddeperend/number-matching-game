const ghpages = require('gh-pages');


ghpages.publish('dist', {
  repo: `git@github.com:Berenddeperend/number-matching-game.git`,
  branch: 'dist'
}, function(err) {
  if(err) {
    console.log('err: ', err);
  } else {
    console.log('uploaded succesful.')
  }
});