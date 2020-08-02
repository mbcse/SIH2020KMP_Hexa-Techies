var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'aditya01070107@gmail.com',
  password: 'aditya@1234',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {
      rejectUnauthorized: false
  },
  debug: function (data) {} 

});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}
var fs = require('fs'), fileStream;
imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    imap.search([ 'UNSEEN', ['SINCE', 'August 2, 2020'] ], function(err, results) {
      if (err) throw err;
      var f = imap.fetch(results, { bodies: '1' });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          console.log(prefix + 'Body');
          stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
        });
        msg.once('attributes', function(attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });
});
imap.connect();