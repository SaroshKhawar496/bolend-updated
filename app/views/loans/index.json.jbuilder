json.loaned_out_items @user.items do |item|
  if item.borrower.present?
    json.my_item item
    json.loan_info item.loan
    json.borrowing_user item.borrower
  end
end

json.borrowing_items @user.borrowed_items do |item|
  json.item item
end