# display in reverse order (i.e. newest tags first)
json.hashtags @hashtags.reverse do |hashtag|
  json.merge! hashtag.attributes
  # if hashtag.hashtaggables.present?   # include this regardless
    json.items_with_hashtag hashtag.hashtaggables do |item|
      json.item item
    end
  # end
end