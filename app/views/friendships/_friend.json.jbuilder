json.id friend.id
json.fname friend.fname
json.lname friend.lname
json.email friend.email
json.image rails_blob_url(friend.image) if friend.image.attached?