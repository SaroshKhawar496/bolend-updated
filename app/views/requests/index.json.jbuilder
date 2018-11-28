# json.incoming_requests @user.requests do |item|
#   if item.requesting_users.present?
#     json.item item
#     json.requests item.requests do |request|
#       json.request request
#       json.requesting_user request.user
#     end
#   end
# end

# json.incoming_requests @user.requests do |request|
#   json.request request
#   json.requesting_user request.user
#   json.item request.item
# end

json.incoming_requests @incoming_requests do |request|
  json.id request.id      # request id
  json.created_at request.created_at
  json.updated_at request.updated_at
  json.request_status request.status
  json.days request.days
  json.user_id request.user_id
  json.item do |item|
    json.id request.item_id
    json.name item.name
  end

  json.requesting_user request.user
end

json.outgoing_requests @user.requests do |request|
  json.id request.id      # request id
  json.created_at request.created_at
  json.updated_at request.updated_at
  json.request_status request.status
  json.days request.days
  json.user_id request.user_id
  json.item_id request.item_id

  json.requesting_user request.user
  json.item request.item
end


# json.outgoing_requests @user.requested_items do |item|
#   json.item item
#   json.user item.user
# end
