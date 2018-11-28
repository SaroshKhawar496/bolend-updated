json.partial! "items/item", item: @item
json.name @item.name
json.description @item.description
json.tags @item.tags
json.image rails_blob_url(@item.image) if @item.image.attached?
json.base64 @item.base64
json.total_hits @item.hits
json.hits_1week @item.hits(1.week.ago)
if @item.user_id == current_user.id
  if @item.requests.present?
    json.requests @item.requests do |request|
      json.id request.id
      json.requesting_user request.user
      json.request_status request.status
      json.created_at request.created_at
      json.updated_at	request.updated_at
    end
  end
end
json.loan @item.loan if @item.loan.present?
json.loaning_user @item.loan.user if @item.loan.present?