# ember-addons-server
API server for [broccoliplugins.com](Broccoli Plugins)

# Getting started 

- Install Node.js 
- Install Postgresql
- Import `schema.sql` in to your Postgres database
- Change relevant .env environment variables

# Heroku 

- Setup a Node.js app and deploy code 
- Setup a database via the heroku-postgresql addon: `heroku addons:add heroku-postgresql:hobby-dev`
- Setup environment variables via `config:set` or the control panel
- Import `schema.sql` in to database: `heroku pg:psql --app broccoli-plugins < schema.sql`
- Run the update.js file manually or as a background-process: `heroku run node update.js`

# S3 Configuration

Whichever bucket you decide to use, you'll need to setup a policy on the bucket to allow public reading of files, and a CORS policy, like so:

## Bucket Policy (allows public reading of files) 

```
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<BUCKET NAME>/*"
    }
  ]
}
```

## CORS Policy 

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
    </CORSRule>
</CORSConfiguration>
```

# Environment variables

You'll need to setup a few environment variables. The easiest way to do this locally is to place a `.env` file in the root of the project with the following envrionment variables:

```
PORT=3000

DATABASE_URL='postgres://'

AWS_ACCESS_KEY=''
AWS_SECRET_KEY=''
AWS_BUCKET_NAME=''
AWS_REGION=''

PAGES_FILENAME='pages-dev.json'
PLUGIN_JSON_FILENAME='plugins-dev.json'
FEED_FILENAME='feed-dev.xml'

MAX_ITEMS_PER_PAGE='100'
```
