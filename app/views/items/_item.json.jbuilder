json.extract! item, :id, :created_at, :updated_at, :name, :description, :tags #, :user
json.url item_url(item, format: :json)
json.image rails_blob_url(item.image) if item.image.attached?

# hits
json.total_hits item.hits
json.hits_1week item.hits(1.week.ago)

# omit the owner's User model from this partial - we do not always want to include that