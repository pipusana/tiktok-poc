const TikTokScraper = require('tiktok-scraper')
const MongoClient = require('mongodb').MongoClient

const formatter = tiktokData => {
  return tiktokData.map(data => {
    return {
      post_id: data.id,
      text: data.text,
      create_time: data.createTime,
      link: data.webVideoUrl,
      hashtags: data.hashtags.map(hashtag => hashtag.name),
      engagement: {
        digg_count: data.diggCount,
        share_count: data.shareCount,
        play_count: data.playCount,
        comment_count: data.commentCount,
      },
      author: {
        user_id: data.authorMeta.id,
        user_name: data.authorMeta.name,
        user_display_name: data.authorMeta.nickName,
        description: data.authorMeta.signature,
        user_image_profile: data.authorMeta.avatar,
        engagement: {
          following: data.authorMeta.following,
          fans: data.authorMeta.fans,
          heart: data.authorMeta.heart,
          video: data.authorMeta.video,
          digg: data.authorMeta.digg,
        },
      },
    }
  })
}

;(async () => {
  const uri = 'mongodb://tiktok:tiktoktiktok@localhost:27020'
  const dbName = 'tiktok'
  const mongoClient = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  })
  const mongoDB = mongoClient.db(dbName)
  const mongoCollection = mongoDB.collection('data')
  let posts = undefined
  try {
    posts = await TikTokScraper.user('pokmindset', {
      number: 70,
    })
  } catch (error) {
    console.log(error)
  }
  const result = formatter(posts.collector)
  await mongoCollection.insertMany(result)
  console.log('-- End Process --')
})()
