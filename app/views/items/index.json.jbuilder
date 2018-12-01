json.items @items do |item|
  if !item.loan.present? || item.loan.date_of_return.present?
    json.partial! "items/item", locals: { item: item }
    json.user item.user
  end
end

json.partial! "pagination/pagination", locals: {model: @items, per_page: @per_page}