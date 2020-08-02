var fs =require('fs');;
var base64=require('base64-stream');
var path=require('path');
var simpleParser=require('mailparser');
var Imap=require('imap');

module.exports= class ReadMailExecutor {

constructor(props) {
    this.execute = this.execute.bind(this);
}


/**
 * Read an email.
 *
 * @param {*} userConfig
 */
async execute(emailconfigProp, parent) {
    const me = this;

    // host gmail
     const imap = new Imap({
         user: 'kashyap.singh52@gmail.com',
         password: '8107170273',
         host: 'imap.gmail.com',
         port: 993,
         tls: true,
     });

    console.log('Starting read mail.....');
    imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
            if (err) {
                console.log(err);
            }
            // save the emails at tmp directory
            const dir = './tmp';
             if (!fs.existsSync(path.join('<path to store>', dir))) {
                fs.mkdirSync(path.join('<path to store>', dir));
             }
            // Search emails having "hello world" in their Subject headers
            imap.search(['UNSEEN', ['HEADER', 'SUBJECT', 'hello world']], (err1, results) => {
                if (err1) {
                    console.log(err1);
                }
                try {
                    // fetch the full email body '' 
                    const f = imap.fetch(results, {
                        bodies: '', // "[\'HEADER.FIELDS (FROM TO SUBJECT DATE)\', '']",
                        struct: true,
                    });
                    f.on('message', (msg, seqno) => {
                        const prefix = `(#${seqno}) `;
                        msg.on('body', (stream, info) => {
                            simpleParser(stream, (err2, mail) => {
                                if (err2) {
                                    console.log('Read mail executor error .....', err2);
                                    
                                }
                                // mail will have everything, create meaningful data from it.
                                const fileName = `msg-${seqno}-body.txt`;
                                const fullFilePath = path.join('<path to store>', dir, fileName);
                                const emailEnvolope = {};
                                emailEnvolope.from = mail.from.text;
                                emailEnvolope.date = mail.date;
                                emailEnvolope.to = mail.to.text;
                                emailEnvolope.subject = mail.subject;
                                emailEnvolope.text = mail.text;
                                emailEnvolope.attachments = [];

                                // write attachments
                                for (let i = 0; i < mail.attachments.length; i += 1) {
                                    const attachment = mail.attachments[i];
                                    const { filename } = attachment;
                                    emailEnvolope.attachments.push(filename);
                                   fs.writeFileSync(path.join('C:\Users\kashy\OneDrive\Desktop\readmail'), dir, filename, attachment.content, 'base64'); // take encoding from attachment ?
                                }
                                const contents = JSON.stringify(emailEnvolope);
                               fs.writeFileSync(fullFilePath, contents);
                                console.log('processing mail done....');
                            });
                        });

                        msg.once('attributes', (attrs) => {
                            // Mark the above mails as read
                            const { uid } = attrs;
                            imap.addFlags(uid, ['\\Seen'], (err2) => {
                                if (err2) {
                                    console.log(err2);
                                } else {
                                    console.log('Marked as read!');
                                }
                            });
                        });
                    });
                    f.once('end', () => {
                        imap.end();
                    });
                } catch (errorWhileFetching) {
                    log(errorWhileFetching.message);
                    if (errorWhileFetching.message === 'Nothing to fetch') {
                        console.log('no mails fetched, temp directory not created');
                        imap.end();
                    }
                    imap.end();
                }
            });
        }); // close open mailbox
    }); // close ready

    // if error occurs in connection making
    imap.once('error', (err) => {
        console.log('Read mail  error .....', err);
    });
    // Once it ends
    imap.once('end', () => {
        console.log('Read mail finished .....');
       
    });
    // initiating connection
    imap.connect();
  }}