class Notification < ApplicationRecord
	belongs_to :recipient, class_name: "User"
  belongs_to :sender, class_name: "User"
  belongs_to :notifiable_object, polymorphic: true #notifiable object doesn't have one type


  scope :unread, ->{ where(read_at: nil)}
end
