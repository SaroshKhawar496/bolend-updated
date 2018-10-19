class Item < ApplicationRecord
  belongs_to :user
  has_one_attached :image # one-to-one relationship
end
