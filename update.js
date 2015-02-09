var EmberAddons = require('./lib/ember_addons'),
    DB = require('./lib/db'),
    dotenv = require('dotenv'),
    s3 = require('./lib/s3_repo'),
    RssFeed = require('./lib/rss');

// load vars
dotenv.load();

// Init
var emaddons = new EmberAddons({debug: true});

var db = new DB({
  databaseURL: process.env.DATABASE_URL,
  debug: true
});

var s3repo = new s3({
  key: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucket: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_REGION || 'us-standard',
  pagesFilename: process.env.PAGES_FILENAME,
  pluginFilename: process.env.PLUGIN_JSON_FILENAME,
  feedFilename: process.env.FEED_FILENAME,
  maxItemsPerPage: parseInt(process.env.MAX_ITEMS_PER_PAGE, 10)
});

var feed = new RssFeed({
  language: 'en',
  pubDate: new Date(),
  title: 'Broccoli Plugins',
  description: 'Listing hundreds of plugins for Broccoli.',
  'feed_url': 'https://' + process.env.AWS_BUCKET_NAME + '.s3.amazonaws.com/' + process.env.FEED_FILENAME,
  'site_url': 'http://broccoliplugins.com/'
});

var startTime = new Date().getTime();

// Update addons
console.log('--> Fetching data from npm registry...');
emaddons.fetchAllWithDetailsAndDownloadsSorted()
  .then(function(results) {
    console.log('--> Done fetching data.');

    console.log('--> Creating Feed...');
    var feedXML = feed.getXml(results);

    // Save files to S3
    return s3repo.saveAddonPages(results)
      .then(s3repo.saveAddonData(results))
      .then(s3repo.saveAddonFeed(feedXML))
      .then(function() {
        return results;
      });
  })
  .then(function(results) {
    console.log('--> Done updating %s addons.', results.length);
    return db.updateTotalMetric(results.length);
  })
  .then(function() {
    db.close();

    var totalTime = (new Date().getTime() - startTime) / 1000;
    console.log('--> Duration: ' + totalTime + 's');
  })
  .catch(function(err) {
    console.error(err);
    db.close();
  });
