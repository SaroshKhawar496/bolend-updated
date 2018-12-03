json.partial! "items/item", item: @item

# display the owner's information
json.user @item.user

# show incoming requests for this item, if the owner is requesting it
if @item.user_id == current_user.id
  if @item.requests.present?
    json.requests @item.requests do |request|
      json.partial! "requests/request", locals: { request: request }
      # json.id request.id
      json.requesting_user request.user
      # json.request_status request.status
      # json.created_at request.created_at
      # json.updated_at	request.updated_at
    end
  end
end
json.loan @item.loan if @item.loan.present?
json.loaning_user @item.loan.user if @item.loan.present?
json.loan_active !@item.loan.date_of_return.present? if @item.loan.present?