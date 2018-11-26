class Notification < ApplicationRecord

  #Sending the Notification Email 
  after_save :send_email

  belongs_to :recipient, class_name: "User"
  belongs_to :sender, class_name: "User"
  belongs_to :notifiable_object, polymorphic: true #notifiable object doesn't have one type


  scope :unread, ->{ where(read_at: nil)}


  #Email funciton
  def send_email
  	# Check the notification action here: 1.item_request => Item borrow Request Email, 2.accept_item_request => Your Request was Accepted
  	if (Notification.action == "item_request")
  		recepient_user = User.find_by_id(Notification.recipient_id)
  		# call the notification_mailer function item_request_email(user) and pass recepient_user as an argument
  		NotificationMailer.item_request_email(recepient_user).deliver
  	elsif (Notification.action == "accept_item_request")
  	
  	end

  end

end
