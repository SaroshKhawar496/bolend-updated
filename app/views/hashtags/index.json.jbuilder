json.hashtags @hashtags do |hashtag|
  json.hashtag hashtag
  if hashtag.hashtaggables.present?
    json.items_with_hashtag hashtag.hashtaggables do |item|
      json.item item
    end
  end
end