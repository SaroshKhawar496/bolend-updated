json.hashtag @hashtag
if @hashtagged.present?
  json.items_with_hashtag @hashtagged do |item|
    json.merge! item.attributes
    # json.item item
    json.image rails_blob_url(item.image) if item.image.attached?
    json.user item.user
  end
end