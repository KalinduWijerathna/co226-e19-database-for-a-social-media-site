const login = require("./login")(db, secret.secreteKey); 
const signu = require("./signup")(db); 
const updat = require("./update_profile")(db); 
const riend = require("./search_friend")(db); 
const lobal = require("./search_global")(db); 
const pfeed = require("./post_feed")(db); 
const pture = require("./profile_picture")(db, server); 
const pkost = require("./post")(db); 
const poike = require("./post_like")(db); 
const coent = require("./comment")(db); 
const cokke = require("./comment_like")(db); 
const diske = require("./display_profile")(db); 
const medid = require("./media_upload")(server);
const friet = require("./friend_request");

