json.hashtag @hashtag
if @hashtagged.present?
  json.items_with_hashtag @hashtagged do |item|
    if privilege(item.user.id)
      json.partial! "items/item", locals: { item: item }
      json.user item.user
    end
  end
end