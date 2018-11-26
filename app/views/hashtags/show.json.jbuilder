json.hashtag @hashtag
if @hashtagged.present?
  json.items_with_hashtag @hashtagged do |item|
    json.item item
  end
end