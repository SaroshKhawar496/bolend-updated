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
  json.request request
  json.requesting_user request.user
  # json.item request.item
end

json.outgoing_requests @user.requests do |request|
  json.request request
  json.requesting_user request.user
  json.item request.item
end


# json.outgoing_requests @user.requested_items do |item|
#   json.item item
#   json.user item.user
# end
