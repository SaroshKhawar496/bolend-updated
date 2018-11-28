class Request < ApplicationRecord
  belongs_to :user
  belongs_to :item
  
  scope :pending, ->{ where(status: 'pending')}
  scope :accepted, ->{ where(status: 'accepted')}
  scope :declined, ->{ where(status: 'declined')}

end
