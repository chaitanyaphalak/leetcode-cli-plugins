var cp = require('child_process');

var log = require('../log');
var Plugin = require('../plugin');

// [prerequisite]
//
// Need install cpplint:
//   https://raw.githubusercontent.com/google/styleguide/gh-pages/cpplint/cpplint.py
//
// [config]
//
// You can disable/enable some checks in "flags" section.
//
// "PLUGINS": {
//   "cpp.lint": {
//     "bin": "<path of cpplint script>",
//     "flags": [
//       "-whitespace/indent",
//       <other flags>
//     ]
//   }
// }
var plugin = new Plugin(100, 'cpp.lint', '2017.07.27',
    'Plugin to do static code check on c++ code.');

var DEFAULT_FLAGS = [
  '-legal/copyright',
  '-build/include_what_you_use'
];

plugin.testProblem = function(problem, cb) {
  var flags = DEFAULT_FLAGS.concat(plugin.config.flags || []);

  var cmd = [
    plugin.config.bin,
    '--filter=' + flags.join(','),
    problem.file
  ].join(' ');

  log.info('\nRunning cpplint ...');
  log.debug(cmd);
  log.info();

  cp.exec(cmd, function(e, stdout, stderr) {
    if (e) {
      stderr.split('\n').forEach(function(line) {
        if (line.length > 0) log.error(line);
      });
    } else {
      plugin.next.testProblem(problem, cb);
    }
  });
};

module.exports = plugin;
