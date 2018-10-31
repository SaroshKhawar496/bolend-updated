json.extract! item, :id, :created_at, :updated_at, :user
json.url item_url(item, format: :json)