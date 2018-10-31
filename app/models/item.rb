class Item < ApplicationRecord
  respond_to :json

  belongs_to :user
  has_one_attached :image # one-to-one relationship

  has_many :requests, dependent: :destroy
  has_many :requesting_users, :through => :requests, :source => :user
end
