# display in reverse order (i.e. newest tags first)
json.hashtags @hashtags.reverse do |hashtag|
  json.merge! hashtag.attributes
  # if hashtag.hashtaggables.present?   # include this regardless
    json.items_with_hashtag hashtag.hashtaggables do |item|
      json.merge! item.attributes
      json.user item.user
      json.image rails_blob_url(item.image) if item.image.attached?
    end
  # end
end

json.partial! "pagination/pagination", locals: {model: @hashtags, per_page: @per_page}