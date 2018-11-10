json.incoming_requests @user.items do |item|
  if item.requesting_users.present?
    json.my_item item
    json.requests item.requests do |request|
      json.request_id request.id
      json.requesting_user request.user
    end
  end
end

json.outgoing_requests @user.requested_items do |item|
  json.item item
end
