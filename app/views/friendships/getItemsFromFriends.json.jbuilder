json.items @unloanedFriendItems.reverse do |item|
  if ! item.borrower.present?
    json.id item.id
    json.name item.name
    json.desc item.description
    json.tags item.tags
    json.user item.user
    json.image rails_blob_url(item.image) if item.image.attached?
    json.total_hits item.hits
    json.hits_1week item.hits(1.week.ago)
  end
end