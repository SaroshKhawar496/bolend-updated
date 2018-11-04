json.incoming_requests @user.items do |item|
  json.my_item item
  json.requesting_users item.requesting_users do |requesting_user|
    json.requester requesting_user
  end
end

json.outgoing_requests @user.requested_items do |item|
  json.item item
end
