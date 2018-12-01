json.items @unloanedFriendItems.reverse do |item|
  if !item.loan.present? || item.loan.date_of_return.present?
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

json.partial! "pagination/pagination", locals: {model: @items, per_page: @per_page}